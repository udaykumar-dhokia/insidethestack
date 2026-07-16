import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiGoneResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';

import { SignupInitiateDto } from './dto/signup-initiate.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
        access_token: 'eyJhbGciOiJIUzI1NiIsInR...',
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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with email and password',
    description: 'Authenticates a user and returns a JWT access token.',
  })
  @ApiOkResponse({
    description: 'Login successful.',
    schema: {
      example: {
        message: 'Login successful',
        user: {
          id: 'uuid',
          email: 'john@example.com',
          first_name: 'John',
          last_name: 'Doe',
          username: 'johndoe',
          isEmailVerified: true,
        },
        access_token: 'eyJhbGciOiJIUzI1NiIsInR...',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password.' })
  @ApiBadRequestResponse({ description: 'Validation error in request body.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
