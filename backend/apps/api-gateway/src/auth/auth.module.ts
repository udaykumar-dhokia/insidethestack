import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../shared/prisma.service';
import { RmqModule } from '@app/shared';

@Module({
  imports: [RmqModule.register({ name: 'EMAIL_SERVICE', queue: 'email_queue' })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}