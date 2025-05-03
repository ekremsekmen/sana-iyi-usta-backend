import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerOwnerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    const customerId = request.params.id;
    
    const vehicleId = request.params.vehicleId;
    
    try {
      const customer = await this.prisma.customers.findUnique({
        where: { id: customerId }
      });
      
      if (!customer) {
        throw new NotFoundException('Müşteri profili bulunamadı.');
      }
      
      if (customer.user_id !== user.id) {
        throw new ForbiddenException('Bu müşteri profiline erişim yetkiniz yok.');
      }
      
      request.customer = customer;
      
      if (vehicleId) {
        const vehicle = await this.prisma.customer_vehicles.findFirst({
          where: { 
            id: vehicleId,
            customer_id: customerId
          }
        });
        
        if (!vehicle) {
          throw new ForbiddenException('Bu araca erişim yetkiniz yok veya araç bulunamadı.');
        }
        
        request.vehicle = vehicle;
      }
      
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }
  }
}