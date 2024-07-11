import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthResolver } from './auth.resolver';
// import { JwtAuthGuard } from '../guards/gql-auth.guard';
import { UsersService } from '../users/users.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { VonageService } from 'src/vonage/vonage.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    UsersService,
    JwtStrategy,
    GoogleStrategy,
    VonageService,
    ConfigService,
  ],
})
export class AuthModule {}
