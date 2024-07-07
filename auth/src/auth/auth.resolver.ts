import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../dto/create-user.input';
import { LoginUserInput } from '../dto/login-user.input';
import { LoginResponse } from '../dto/login-response';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  healthCheck() {
    return 'Auth Service is up and running!';
  }

  @Mutation(() => LoginResponse)
  async register(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<LoginResponse> {
    return this.authService.register(createUserInput);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginUserInput,
  ): Promise<LoginResponse> {
    return this.authService.login(loginInput);
  }
}
