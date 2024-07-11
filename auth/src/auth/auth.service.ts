import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserInput } from '../dto/user.input';
import { LoginResponse } from '../dto/login-response';
import { LoginUserInput } from '../dto/login-user.input';
import { VonageService } from '../vonage/vonage.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private vonageService: VonageService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginInput: LoginUserInput): Promise<LoginResponse> {
    const user = await this.usersService.findOneByEmail(loginInput.email);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    if (user.two_fa) {
      await this.vonageService.sendVerificationCode(user.id, user.phone);
      return {
        access_token: '',
        userId: user.id,
      };
    }

    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      userId: user.id,
    };
  }

  async register(data: UserInput): Promise<LoginResponse> {
    const existingUser = await this.usersService.findOneByEmail(data.email);
    if (existingUser) {
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
    return {
      access_token: this.jwtService.sign(payload),
      userId: user.id,
    };
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from Google';
    }

    const payload = {
      email: req.user.email,
      sub: req.user.accessToken,
    };

    return {
      message: 'User information from Google',
      user: req.user,
      token: this.jwtService.sign(payload),
    };
  }

  async enableTwoFA(userId: string, enable: boolean): Promise<boolean> {
    try {
      const updatedUser = await this.usersService.updateTwoFA(userId, enable);
      if (updatedUser) {
        return updatedUser.two_fa === enable;
      }
      return false;
    } catch (error) {
      console.error(
        `Failed to update 2FA for user ${userId}: ${error.message}`,
      );
      return false;
    }
  }

  async verifyTwoFACode(
    userId: string,
    receivedCode: string,
  ): Promise<LoginResponse> {
    const isValid = await this.vonageService.verifyCode(receivedCode);

    if (!isValid) {
      throw new Error('Invalid or expired verification code');
    }

    const user = await this.usersService.findOneById(userId);
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return {
      access_token: accessToken,
      userId: user.id,
    };
  }
}
