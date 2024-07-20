import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { WinstonLoggerService } from 'src/winston-logger.service';

@Module({
  providers: [UsersService, PrismaService, WinstonLoggerService],
  exports: [UsersService],
})
export class UsersModule {}
