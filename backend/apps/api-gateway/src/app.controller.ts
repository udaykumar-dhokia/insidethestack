import { Controller, Get, Inject, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@ApiTags('General')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('EMAIL_SERVICE') private readonly emailClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check', description: 'Returns a greeting string to confirm the API is running.' })
  @ApiOkResponse({ description: 'API is running.', schema: { example: 'Hello World!' } })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send-test-email')
  @ApiOperation({
    summary: 'Send a test email',
    description: 'Enqueues a test email job via RabbitMQ to `test@example.com`. Useful for verifying the email service is connected.',
  })
  @ApiCreatedResponse({
    description: 'Email task queued successfully.',
    schema: { example: { message: 'Email task sent to queue' } },
  })
  sendTestEmail() {
    this.emailClient.emit('send_email', {
      to: 'test@example.com',
      subject: 'Test Email from API Gateway',
    });
    return { message: 'Email task sent to queue' };
  }
}
