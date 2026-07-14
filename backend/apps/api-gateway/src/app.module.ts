import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqModule } from '@app/shared';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    RmqModule.register({ name: 'EMAIL_SERVICE', queue: 'email_queue' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
