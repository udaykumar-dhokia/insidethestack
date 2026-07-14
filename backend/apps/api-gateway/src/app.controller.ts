import { Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('EMAIL_SERVICE') private readonly emailClient: ClientProxy
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send-test-email')
  sendTestEmail() {
    this.emailClient.emit('send_email', {
      to: 'test@example.com',
      subject: 'Test Email from API Gateway',
    });
    return { message: 'Email task sent to queue' };
  }
}
