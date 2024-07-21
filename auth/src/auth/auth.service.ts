import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserInput } from '../dto/user.input';
import { LoginResponse } from '../dto/login-response';
import { LoginUserInput } from '../dto/login-user.input';
import { VonageService } from '../vonage/vonage.service';
import { WinstonLoggerService } from '../winston-logger.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private vonageService: VonageService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    this.logger.log('Validating user');
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      this.logger.log('User validated');
      return result;
    }
    this.logger.warn('User validation failed');
    return null;
  }

  async login(loginInput: LoginUserInput): Promise<LoginResponse> {
    this.logger.log('Logging in user');
    const user = await this.usersService.findOneByEmail(loginInput.email);
    if (!user) {
      this.logger.error('User not found');
      throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      user.password,
    );
    if (!isPasswordValid) {
      this.logger.error('Invalid password');
      throw new Error('Invalid password');
    }

    if (user.two_fa) {
      this.logger.log(
        'Two-factor authentication enabled, sending verification code',
      );
      await this.vonageService.sendVerificationCode(user.id, user.phone);
      return {
        access_token: '',
        userId: user.id,
      };
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log('User logged in successfully');
    return {
      access_token: accessToken,
      userId: user.id,
    };
  }

  async register(data: UserInput): Promise<LoginResponse> {
    this.logger.log('Registering user'); // Log the action
    const existingUser = await this.usersService.findOneByEmail(data.email);
    if (existingUser) {
      this.logger.error('User already registered with this email');
      throw new Error('User already registered with this email');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.usersService.create({
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      two_fa: false,
    });
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log('User registered successfully');
    return {
      access_token: accessToken,
      userId: user.id,
    };
  }

  googleLogin(req) {
    this.logger.log('Logging in user with Google');
    if (!req.user) {
      this.logger.warn('No user from Google');
      return 'No user from Google';
    }

    const payload = {
      email: req.user.email,
      sub: req.user.accessToken,
    };

    this.logger.log('User logged in with Google successfully');
    return {
      message: 'User information from Google',
      user: req.user,
      token: this.jwtService.sign(payload),
    };
  }

  async enableTwoFA(userId: string, enable: boolean): Promise<boolean> {
    this.logger.log(
      `Setting two-factor authentication to ${enable} for user ${userId}`,
    );
    try {
      const updatedUser = await this.usersService.updateTwoFA(userId, enable);
      if (updatedUser) {
        this.logger.log(
          `Two-factor authentication set to ${enable} for user ${userId}`,
        );
        return updatedUser.two_fa === enable;
      }
      this.logger.warn(
        `Failed to set two-factor authentication for user ${userId}`,
      );
      return false;
    } catch (error) {
      this.logger.error(
        `Failed to update 2FA for user ${userId}: ${error.message}`,
      );
      return false;
    }
  }

  async verifyTwoFACode(
    userId: string,
    receivedCode: string,
  ): Promise<LoginResponse> {
    this.logger.log('Verifying two-factor authentication code');
    const isValid = await this.vonageService.verifyCode(receivedCode);

    if (!isValid) {
      this.logger.error('Invalid or expired verification code');
      throw new Error('Invalid or expired verification code');
    }

    const user = await this.usersService.findOneById(userId);
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log('Two-factor authentication code verified successfully');
    return {
      access_token: accessToken,
      userId: user.id,
    };
  }
}
