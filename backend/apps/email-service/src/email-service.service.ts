import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface SendOtpPayload {
  to: string;
  first_name: string;
  otp: string;
}

@Injectable()
export class EmailServiceService {
  private readonly logger = new Logger(EmailServiceService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtpEmail(payload: SendOtpPayload): Promise<void> {
    const { to, first_name, otp } = payload;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify your email – InsideTheStack</title>
        </head>
        <body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0"
                  style="background:#111111;border:1px solid #222222;border-radius:12px;overflow:hidden;">

                  <!-- Header -->
                  <tr>
                    <td style="padding:32px 40px 24px;border-bottom:1px solid #222222;">
                      <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                        InsideTheStack
                      </p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:36px 40px 32px;">
                      <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#ffffff;">
                        Hi ${first_name}, verify your email
                      </p>
                      <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#888888;">
                        Use the one-time code below to complete your signup. This code expires in
                        <strong style="color:#aaaaaa;">10 minutes</strong>.
                      </p>

                      <!-- OTP Box -->
                      <div style="text-align:center;margin:0 0 32px;">
                        <div style="display:inline-block;background:#1a1a1a;border:1px solid #333333;
                          border-radius:10px;padding:20px 40px;">
                          <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#ffffff;
                            font-variant-numeric:tabular-nums;">
                            ${otp}
                          </span>
                        </div>
                      </div>

                      <p style="margin:0;font-size:13px;color:#555555;line-height:1.6;">
                        If you didn't create an account on InsideTheStack, you can safely ignore this email.
                        Someone may have entered your email address by mistake.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 40px;border-top:1px solid #222222;">
                      <p style="margin:0;font-size:12px;color:#444444;">
                        © ${new Date().getFullYear()} InsideTheStack · All rights reserved
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"InsideTheStack" <${process.env.SMTP_USER}>`,
        to,
        subject: `${otp} is your InsideTheStack verification code`,
        html,
      });
      this.logger.log(`OTP email sent to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send OTP email to ${to}`, err);
      throw err;
    }
  }

  /** Generic email sender (kept for other use-cases) */
  async sendEmail(data: { to: string; subject: string; html: string }) {
    try {
      await this.transporter.sendMail({
        from: `"InsideTheStack" <${process.env.SMTP_USER}>`,
        to: data.to,
        subject: data.subject,
        html: data.html,
      });
      this.logger.log(`Email sent to ${data.to} — subject: ${data.subject}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${data.to}`, err);
      throw err;
    }
  }
}
