import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailServiceService {
  private readonly logger = new Logger(EmailServiceService.name);

  sendEmail(data: any) {
    this.logger.log(`Sending email to ${data.to} with subject: ${data.subject}`);
    // Implement email sending logic here
  }
}
