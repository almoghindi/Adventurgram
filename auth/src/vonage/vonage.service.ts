import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

import { Vonage } from '@vonage/server-sdk';

@Injectable()
export class VonageService {
  private vonage: Vonage;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.vonage = new Vonage(
      //@ts-ignore
      {
        apiKey: 'be76dda7',
        apiSecret: 'K7oO5bmfbHEwNfV4',
      },
    );
  }

  async sendVerificationCode(userId: string, to: string): Promise<string> {
    try {
      const from = 'Vonage APIs';
      const verificationCode = this.generateSixDigitCode();
      const text = `Your verification code is: ${verificationCode}`;
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      await this.prisma.verificationCode.create({
        data: {
          userId,
          code: verificationCode,
          expiresAt,
        },
      });

      const response = await this.vonage.sms.send({ to, from, text });
      if (response.messages[0].status !== '0') {
        throw new Error(
          `Vonage SMS sending failed with error: ${response.messages[0]['error-text']}`,
        );
      }

      return verificationCode;
    } catch (error) {
      console.error(`Failed to send SMS: ${error.message}`);
      throw error;
    }
  }

  async verifyCode(receivedCode: string): Promise<boolean> {
    const sentCode = await this.prisma.verificationCode.findFirst({
      where: { code: receivedCode },
    });

    if (!sentCode) {
      throw new Error('Invalid verification code');
    }

    if (sentCode.expiresAt < new Date()) {
      throw new Error('Expired verification code');
    }

    if (sentCode.code === receivedCode) {
      await this.prisma.verificationCode.delete({ where: { id: sentCode.id } });
      return true;
    }
    return false;
  }

  private generateSixDigitCode(): string {
    const min = 100000;
    const max = 999999;
    const code = Math.floor(Math.random() * (max - min + 1)) + min;
    return code.toString();
  }
}
