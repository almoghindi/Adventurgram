import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { VonageService } from '../../vonage/vonage.service';
import { UserInput } from '../../dto/user.input';
import { LoginUserInput } from '../../dto/login-user.input';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockUsersService = {
  findOneByEmail: jest.fn(),
  create: jest.fn(),
  updateTwoFA: jest.fn(),
  findOneById: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

const mockVonageService = {
  sendVerificationCode: jest.fn(),
  verifyCode: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: VonageService, useValue: mockVonageService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate and return user data', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
      };
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toEqual({ id: '1', email: 'test@test.com' });
    });

    it('should return null if validation fails', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user id if login is successful', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
        two_fa: false,
      };
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('token');

      const loginInput: LoginUserInput = {
        email: 'test@test.com',
        password: 'password',
      };
      const result = await service.login(loginInput);
      expect(result).toEqual({ access_token: 'token', userId: '1' });
    });

    it('should throw an error if user is not found', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      const loginInput: LoginUserInput = {
        email: 'test@test.com',
        password: 'password',
      };
      await expect(service.login(loginInput)).rejects.toThrow('User not found');
    });

    it('should throw an error if password is invalid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
        two_fa: false,
      };
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const loginInput: LoginUserInput = {
        email: 'test@test.com',
        password: 'password',
      };
      await expect(service.login(loginInput)).rejects.toThrow(
        'Invalid password',
      );
    });

    it('should return empty access token and user id if 2FA is enabled', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
        two_fa: true,
        phone: '1234567890',
      };
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const loginInput: LoginUserInput = {
        email: 'test@test.com',
        password: 'password',
      };
      const result = await service.login(loginInput);
      expect(result).toEqual({ access_token: '', userId: '1' });
    });
  });

  describe('register', () => {
    it('should create a new user and return access token and user id', async () => {
      const mockUserInput: UserInput = {
        email: 'test@test.com',
        password: 'password',
        phone: '1234567890',
      };
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
        phone: '1234567890',
        two_fa: false,
      };
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.register(mockUserInput);
      expect(result).toEqual({ access_token: 'token', userId: '1' });
    });

    it('should throw an error if email is already registered', async () => {
      const mockUserInput: UserInput = {
        email: 'test@test.com',
        password: 'password',
        phone: '1234567890',
      };
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
        phone: '1234567890',
        two_fa: false,
      };
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);

      await expect(service.register(mockUserInput)).rejects.toThrow(
        'User already registered with this email',
      );
    });
  });

  describe('enableTwoFA', () => {
    it('should enable or disable two-factor authentication', async () => {
      const mockUser = { id: '1', email: 'test@test.com', two_fa: true };
      mockUsersService.updateTwoFA.mockResolvedValue(mockUser);

      const result = await service.enableTwoFA('1', true);
      expect(result).toBe(true);
    });

    it('should return false if update fails', async () => {
      mockUsersService.updateTwoFA.mockResolvedValue(null);
      const result = await service.enableTwoFA('1', true);
      expect(result).toBe(false);
    });
  });

  describe('verifyTwoFACode', () => {
    it('should verify the 2FA code and return access token and user id', async () => {
      mockVonageService.verifyCode.mockResolvedValue(true);
      const mockUser = { id: '1', email: 'test@test.com' };
      mockUsersService.findOneById.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.verifyTwoFACode('1', '123456');
      expect(result).toEqual({ access_token: 'token', userId: '1' });
    });

    it('should throw an error if verification code is invalid', async () => {
      mockVonageService.verifyCode.mockResolvedValue(false);
      await expect(service.verifyTwoFACode('1', '123456')).rejects.toThrow(
        'Invalid or expired verification code',
      );
    });
  });
});
