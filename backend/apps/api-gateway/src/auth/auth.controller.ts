import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiGoneResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignupInitiateDto } from './dto/signup-initiate.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({
    summary: '[Legacy] Create user directly',
    description:
      'Creates a user account immediately without email verification. **Deprecated** — prefer the OTP-based flow.',
    deprecated: true,
  })
  @ApiCreatedResponse({ description: 'User created successfully.' })
  @ApiConflictResponse({ description: 'Email is already registered.' })
  @ApiBadRequestResponse({ description: 'Validation error in request body.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('signup')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Initiate OTP signup (Step 1)',
    description:
      'Validates user details, hashes the password, stores a pending signup record, and sends a **6-digit OTP** to the provided email. The OTP expires in **10 minutes**. Re-calling this endpoint replaces the existing OTP.',
  })
  @ApiAcceptedResponse({
    description: 'OTP sent to the provided email address.',
    schema: {
      example: {
        message: 'OTP sent to john@example.com. It expires in 10 minutes.',
      },
    },
  })
  @ApiConflictResponse({
    description:
      'Email is already registered **or** username is already taken.',
  })
  @ApiBadRequestResponse({ description: 'Validation error in request body.' })
  initiateSignup(@Body() dto: SignupInitiateDto) {
    return this.authService.initiateSignup(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Verify OTP and complete signup (Step 2)',
    description:
      'Validates the 6-digit OTP sent during Step 1. On success, creates the user account with `isEmailVerified: true` and deletes the pending OTP record atomically.',
  })
  @ApiCreatedResponse({
    description: 'Account created successfully.',
    schema: {
      example: {
        message: 'Account created successfully. Welcome!',
        user: {
          id: 'uuid',
          email: 'john@example.com',
          first_name: 'John',
          last_name: 'Doe',
          username: 'johndoe',
          isEmailVerified: true,
          created_at: '2026-07-15T12:00:00.000Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid OTP.' })
  @ApiNotFoundResponse({
    description: 'No pending signup found for this email.',
  })
  @ApiGoneResponse({
    description: 'OTP has expired — please restart the signup process.',
  })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }
}
