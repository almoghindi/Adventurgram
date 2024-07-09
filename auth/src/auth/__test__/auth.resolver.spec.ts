import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { UserInput } from '../../dto/user.input';
import { LoginUserInput } from '../../dto/login-user.input';
import { LoginResponse } from '../../dto/login-response';
import { JwtAuthGuard } from '../../guards/gql-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should return a health check message', () => {
      expect(resolver.healthCheck()).toEqual('Auth Service is up and running!');
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      const userInput: UserInput = { email: 'test@test.com', password: 'test' };
      const loginResponse: LoginResponse = {
        access_token: 'token',
        userId: '1',
      };
      jest.spyOn(authService, 'register').mockResolvedValue(loginResponse);

      const result = await resolver.register(userInput);
      expect(result).toEqual(loginResponse);
      expect(authService.register).toHaveBeenCalledWith(userInput);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginInput: LoginUserInput = {
        email: 'test@test.com',
        password: 'test',
      };
      const loginResponse: LoginResponse = {
        access_token: 'token',
        userId: '1',
      };
      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);

      const result = await resolver.login(loginInput);
      expect(result).toEqual(loginResponse);
      expect(authService.login).toHaveBeenCalledWith(loginInput);
    });
  });

  describe('getJwtPayload', () => {
    let guard: JwtAuthGuard;
    let context: ExecutionContext;

    beforeEach(() => {
      guard = new JwtAuthGuard();
      context = {
        switchToHttp: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
        getType: jest.fn(),
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        getArgByIndexAndType: jest.fn(),
        getContext: jest.fn(),
        getContextByArgs: jest.fn(),
        getContextByArgsAndType: jest.fn(),
        getRoot: jest.fn(),
        getRootByArgs: jest.fn(),
        getRootByArgsAndType: jest.fn(),
        getInfo: jest.fn(),
        getInfoByArgs: jest.fn(),
        getInfoByArgsAndType: jest.fn(),
      } as unknown as ExecutionContext;
    });

    it('should get JWT payload', async () => {
      const req = { user: { sub: '1', email: 'test@test.com' } };
      const gqlContext = { req };
      jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
        getContext: () => gqlContext,
      } as GqlExecutionContext);

      const result = await resolver.getJwtPayload(gqlContext);
      expect(result).toEqual({ userId: '1', email: 'test@test.com' });
    });
  });
});
