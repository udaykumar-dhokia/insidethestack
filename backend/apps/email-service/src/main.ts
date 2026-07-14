import { NestFactory } from '@nestjs/core';
import { EmailServiceModule } from './email-service.module';
import { RmqService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(EmailServiceModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('email_queue'));
  await app.startAllMicroservices();
}
bootstrap();
