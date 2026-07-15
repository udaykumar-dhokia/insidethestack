import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Requires a valid JWT access token. Returns the full user profile from the database.',
  })
  @ApiOkResponse({
    description: 'User profile retrieved successfully.',
    schema: {
      example: {
        id: 'uuid',
        username: 'johndoe',
        email: 'john@example.com',
        first_name: 'John',
        last_name: 'Doe',
        isEmailVerified: true,
        created_at: '2026-07-15T12:00:00.000Z',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token.' })
  getProfile(@CurrentUser() userPayload: any) {
    return this.usersService.getUserById(userPayload.sub);
  }
}
