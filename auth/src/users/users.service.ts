import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { WinstonLoggerService } from '../winston-logger.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    this.logger.log(`Finding user by email: ${email}`);
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      this.logger.log(`User found by email: ${email}`);
    } else {
      this.logger.warn(`No user found by email: ${email}`);
    }
    return user;
  }

  async findOneById(id: string): Promise<User | null> {
    this.logger.log(`Finding user by id: ${id}`);
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      this.logger.log(`User found by id: ${id}`);
    } else {
      this.logger.warn(`No user found by id: ${id}`);
    }
    return user;
  }

  async create(data: {
    email: string;
    password: string;
    phone: string;
    two_fa: boolean;
  }): Promise<User> {
    this.logger.log(`Creating user with email: ${data.email}`);
    const user = await this.prisma.user.create({
      data,
    });
    this.logger.log(`User created with email: ${data.email}`);
    return user;
  }

  async updateTwoFA(userId: string, enable: boolean): Promise<User> {
    this.logger.log(
      `Updating two-factor authentication for user ${userId} to ${enable}`,
    );
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { two_fa: enable },
    });
    this.logger.log(
      `Two-factor authentication updated for user ${userId} to ${enable}`,
    );
    return user;
  }
}
