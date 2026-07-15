import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address used during signup',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '482910',
    description: '6-digit OTP sent to the email address',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp!: string;
}
