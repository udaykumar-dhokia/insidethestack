import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  BadRequestException,
  ConflictException,
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../shared/prisma.service';
import { SignupInitiateDto } from './dto/signup-initiate.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailServiceService } from '../../../email-service/src/email-service.service';
import { LoginDto } from './dto/login.dto';
import { firstValueFrom } from 'rxjs';

const OTP_TTL_MINUTES = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    @Inject('EMAIL_SERVICE') private readonly clientProxy: ClientProxy,
    private readonly emailService: EmailServiceService,
  ) {}

  async initiateSignup(data: SignupInitiateDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const existingUsername = await this.prismaService.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username is already taken.');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const otp = crypto.randomInt(100_000, 999_999).toString();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1_000);

    await this.prismaService.otpRequest.upsert({
      where: { email: data.email },
      create: {
        email: data.email,
        otp,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        password: passwordHash,
        expires_at: expiresAt,
      },
      update: {
        otp,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        password: passwordHash,
        expires_at: expiresAt,
      },
    });

    await this.emailService.sendOtpEmail({
      to: data.email,
      first_name: data.first_name,
      otp,
    });

    return {
      message: `OTP sent to ${data.email}. It expires in ${OTP_TTL_MINUTES} minutes.`,
    };
  }

  async verifyOtp(data: VerifyOtpDto) {
    const otpRecord = await this.prismaService.otpRequest.findUnique({
      where: { email: data.email },
    });

    if (!otpRecord) {
      throw new NotFoundException(
        'No pending signup found for this email. Please sign up first.',
      );
    }

    if (new Date() > otpRecord.expires_at) {
      await this.prismaService.otpRequest.delete({
        where: { email: data.email },
      });
      throw new GoneException(
        'OTP has expired. Please start the signup process again.',
      );
    }

    const otpBuffer = Buffer.from(data.otp);
    const storedBuffer = Buffer.from(otpRecord.otp);
    const isMatch =
      otpBuffer.length === storedBuffer.length &&
      crypto.timingSafeEqual(otpBuffer, storedBuffer);

    if (!isMatch) {
      throw new BadRequestException('Invalid OTP. Please try again.');
    }

    const [user] = await this.prismaService.$transaction([
      this.prismaService.user.create({
        data: {
          email: otpRecord.email,
          first_name: otpRecord.first_name,
          last_name: otpRecord.last_name,
          username: otpRecord.username,
          password: otpRecord.password,
          isEmailVerified: true,
        },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          username: true,
          isEmailVerified: true,
          created_at: true,
        },
      }),
      this.prismaService.otpRequest.delete({ where: { email: data.email } }),
    ]);

    this.clientProxy.emit('user.created', {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
    });

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: 'Account created successfully. Welcome!',
      user,
      access_token,
    };
  }

  async login(data: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const payload = { sub: user.id, username: user.username, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        isEmailVerified: user.isEmailVerified,
      },
      access_token,
    };
  }
}
