import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupInitiateDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name (optional)' })
  @IsString()
  last_name?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address — an OTP will be sent here',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'securepassword123',
    description: 'Password (will be bcrypt-hashed before storage)',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  username!: string;
}
