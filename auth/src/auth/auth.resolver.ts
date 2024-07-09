import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserInput } from '../dto/user.input';
import { LoginUserInput } from '../dto/login-user.input';
import { LoginResponse } from '../dto/login-response';
import { JwtPayload } from '../dto/jwt-payload';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/gql-auth.guard';

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
    return this.authService.register(userInput);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginUserInput,
  ): Promise<LoginResponse> {
    return this.authService.login(loginInput);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => JwtPayload)
  async getJwtPayload(@Context() context) {
    return {
      userId: context.req.user.sub,
      email: context.req.user.email,
    };
  }
}
