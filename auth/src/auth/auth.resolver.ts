import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserInput } from '../dto/user.input';
import { LoginUserInput } from '../dto/login-user.input';
import { LoginResponse } from '../dto/login-response';
import { JwtPayload } from '../dto/jwt-payload';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/gql-auth.guard';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  healthCheck() {
    return 'Auth Service is up and running!';
  }

  @Mutation(() => LoginResponse)
  async register(
    @Args('UserInput') userInput: UserInput,
  ): Promise<LoginResponse> {
    const loginResponse = await this.authService.register(userInput);

    return loginResponse;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginUserInput,
  ): Promise<LoginResponse> {
    return await this.authService.login(loginInput);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => JwtPayload)
  async getJwtPayload(@Context() context) {
    const user = context.req.user;
    return {
      userId: user.sub,
      email: user.email,
    };
  }

  @Query(() => String)
  async googleAuth(@Context() context) {
    return this.authService.googleLogin(context);
  }

  @Mutation(() => Boolean)
  async enableTwoFA(
    @Args('userId') userId: string,
    @Args('enable') enable: boolean,
  ): Promise<boolean> {
    return this.authService.enableTwoFA(userId, enable);
  }

  @Mutation(() => String)
  async verifyTwoFACode(
    @Args('userId') userId: string,
    @Args('code') code: string,
  ): Promise<string> {
    const response = await this.authService.verifyTwoFACode(userId, code);
    return response.access_token;
  }
}
