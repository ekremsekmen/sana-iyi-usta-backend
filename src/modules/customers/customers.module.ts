import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomerOwnerGuard } from './guards/customer-owner.guard';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, PrismaService, CustomerOwnerGuard],
  exports: [CustomersService]
})
export class CustomersModule {}