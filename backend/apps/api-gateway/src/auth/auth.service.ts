import * as bcrypt from 'bcrypt';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('EMAIL_SERVICE') private clientProxy: ClientProxy,
  ) {}

  async create(data: CreateUserDto) {
    const existing = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('Email ready registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await this.prismaService.user.create({
      data: {
        email: data.email,
        password: passwordHash,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
      },
    });

    this.clientProxy.emit('user.created', {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
    });

    return user;
  }
}
