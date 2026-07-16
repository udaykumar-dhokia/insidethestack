import { Controller, Get } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { EmailServiceService, SendOtpPayload } from './email-service.service';
import { RmqService } from '@app/shared';

@Controller()
export class EmailServiceController {
  constructor(
    private readonly emailServiceService: EmailServiceService,
    private readonly rmqService: RmqService,
  ) {}

  @Get('/')
  healthCheck() {
    return { status: 'ok', service: 'email-service' };
  }

  @EventPattern('send_otp_email')
  async handleSendOtpEmail(
    @Payload() data: SendOtpPayload,
    @Ctx() context: RmqContext,
  ) {
    await this.emailServiceService.sendOtpEmail(data);
    this.rmqService.ack(context);
  }

  @EventPattern('send_email')
  async handleSendEmail(
    @Payload() data: { to: string; subject: string; html: string },
    @Ctx() context: RmqContext,
  ) {
    await this.emailServiceService.sendEmail(data);
    this.rmqService.ack(context);
  }
}
