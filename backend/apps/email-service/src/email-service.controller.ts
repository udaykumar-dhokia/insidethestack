import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { EmailServiceService } from './email-service.service';
import { RmqService } from '@app/shared';

@Controller()
export class EmailServiceController {
  constructor(
    private readonly emailServiceService: EmailServiceService,
    private readonly rmqService: RmqService
  ) {}

  @EventPattern('send_email')
  async handleSendEmail(@Payload() data: any, @Ctx() context: RmqContext) {
    this.emailServiceService.sendEmail(data);
    this.rmqService.ack(context);
  }
}
