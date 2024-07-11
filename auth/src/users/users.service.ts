import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserInput } from '../dto/user.input';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: {
    email: string;
    password: string;
    phone: string;
    two_fa: boolean;
  }) {
    return this.prisma.user.create({
      data,
    });
  }

  async updateTwoFA(userId: string, enable: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { two_fa: enable },
    });
  }
}
