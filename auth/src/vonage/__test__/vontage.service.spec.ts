import { Test, TestingModule } from '@nestjs/testing';
import { VonageService } from '../vonage.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Vonage } from '@vonage/server-sdk';

const mockPrismaService = {
  verificationCode: {
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
};

describe('VonageService', () => {
  let service: VonageService;
  let sendSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VonageService,
        { provide: ConfigService, useValue: {} },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<VonageService>(VonageService);
    sendSpy = jest
      .spyOn((service as any).vonage.sms, 'send')
      .mockResolvedValue({
        messages: [{ status: '0' }],
      });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationCode', () => {
    it('should send a verification code via SMS', async () => {
      const userId = '1';
      const to = '1234567890';
      const verificationCode = '123456';

      jest
        .spyOn(service as any, 'generateSixDigitCode')
        .mockReturnValue(verificationCode);

      mockPrismaService.verificationCode.create.mockResolvedValue({
        userId,
        code: verificationCode,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      const result = await service.sendVerificationCode(userId, to);
      expect(result).toEqual(verificationCode);
      expect(sendSpy).toHaveBeenCalledWith({
        to,
        from: 'Vonage APIs',
        text: `Your verification code is: ${verificationCode}`,
      });
    });

    it('should throw an error if SMS sending fails', async () => {
      sendSpy.mockResolvedValueOnce({
        messages: [{ status: '1', 'error-text': 'Error' }],
      });

      const userId = '1';
      const to = '1234567890';
      await expect(service.sendVerificationCode(userId, to)).rejects.toThrow(
        'Vonage SMS sending failed with error: Error',
      );
    });
  });

  describe('verifyCode', () => {
    it('should verify the code and return true if valid', async () => {
      mockPrismaService.verificationCode.findFirst.mockResolvedValue({
        id: '1',
        code: '123456',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      const result = await service.verifyCode('123456');
      expect(result).toBe(true);
    });

    it('should throw an error if code is invalid', async () => {
      mockPrismaService.verificationCode.findFirst.mockResolvedValue(null);

      await expect(service.verifyCode('123456')).rejects.toThrow(
        'Invalid verification code',
      );
    });

    it('should throw an error if code is expired', async () => {
      mockPrismaService.verificationCode.findFirst.mockResolvedValue({
        id: '1',
        code: '123456',
        expiresAt: new Date(Date.now() - 5 * 60 * 1000),
      });

      await expect(service.verifyCode('123456')).rejects.toThrow(
        'Expired verification code',
      );
    });
  });
});
