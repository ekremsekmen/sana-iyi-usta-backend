// src/prisma/prisma.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Prisma client connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Prisma client disconnected');
  }
}
