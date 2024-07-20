import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Vonage } from '@vonage/server-sdk';
import { WinstonLoggerService } from '../winston-logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VonageService {
  private vonage: Vonage;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private readonly logger: WinstonLoggerService,
  ) {
    this.vonage = new Vonage(
      //@ts-ignore
      {
        apiKey: this.configService.get<string>('VONAGE_API_KEY'),
        apiSecret: this.configService.get<string>('VONAGE_API_SECRET'),
      },
    );
  }

  async sendVerificationCode(userId: string, to: string): Promise<string> {
    try {
      const from = 'Vonage APIs';
      const verificationCode = this.generateSixDigitCode();
      const text = `Your verification code is: ${verificationCode}`;
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      this.logger.log(`Creating verification code for user ${userId}`);
      await this.prisma.verificationCode.create({
        data: {
          userId,
          code: verificationCode,
          expiresAt,
        },
      });

      this.logger.log(`Sending SMS to ${to}`);
      const response = await this.vonage.sms.send({ to, from, text });
      if (response.messages[0].status !== '0') {
        throw new Error(
          `Vonage SMS sending failed with error: ${response.messages[0]['error-text']}`,
        );
      }

      this.logger.log(`Verification code sent to ${to}`);
      return verificationCode;
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error.message}`);
      throw error;
    }
  }

  async verifyCode(receivedCode: string): Promise<boolean> {
    this.logger.log(`Verifying code: ${receivedCode}`);
    const sentCode = await this.prisma.verificationCode.findFirst({
      where: { code: receivedCode },
    });

    if (!sentCode) {
      this.logger.warn(`Invalid verification code: ${receivedCode}`);
      throw new Error('Invalid verification code');
    }

    if (sentCode.expiresAt < new Date()) {
      this.logger.warn(`Expired verification code: ${receivedCode}`);
      throw new Error('Expired verification code');
    }

    if (sentCode.code === receivedCode) {
      this.logger.log(`Verification code valid: ${receivedCode}`);
      await this.prisma.verificationCode.delete({ where: { id: sentCode.id } });
      return true;
    }
    this.logger.warn(`Verification code mismatch: ${receivedCode}`);
    return false;
  }

  private generateSixDigitCode(): string {
    const min = 100000;
    const max = 999999;
    const code = Math.floor(Math.random() * (max - min + 1)) + min;
    return code.toString();
  }
}
