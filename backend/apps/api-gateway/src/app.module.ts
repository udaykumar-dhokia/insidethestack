import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/shared';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RmqModule.register({ name: 'EMAIL_SERVICE', queue: 'email_queue' }),
    AuthModule,
    UsersModule,
    ArticlesModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
