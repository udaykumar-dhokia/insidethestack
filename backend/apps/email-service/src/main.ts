import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { EmailServiceModule } from './email-service.module';
import { RmqService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(EmailServiceModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('email_queue'));
  await app.startAllMicroservices();

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Email service HTTP dummy server listening on port ${port}`);
}
bootstrap();
