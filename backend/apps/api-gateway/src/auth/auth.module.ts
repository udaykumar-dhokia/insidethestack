import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../shared/prisma.service';
import { RmqModule } from '@app/shared';
import { EmailServiceService } from '../../../email-service/src/email-service.service';

@Module({
  imports: [
    RmqModule.register({ name: 'EMAIL_SERVICE', queue: 'email_queue' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'fallback-secret-key-for-dev-only',
      signOptions: { expiresIn: (process.env.JWT_EXPIRATION || '7d') as any },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, EmailServiceService],
})
export class AuthModule {}
