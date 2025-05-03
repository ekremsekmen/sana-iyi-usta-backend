import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerVehicleDto, UpdateCustomerVehicleDto, CustomerVehicleResponseDto } from './dto/customer-vehicle.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}


  // Kullanıcı ID'sinden müşteri profilini bulma
  async findByUserId(userId: string) {
    const customer = await this.prisma.customers.findFirst({
      where: { user_id: userId }
    });
    
    return {
      hasCustomerProfile: !!customer,
      profile: customer || null
    };
  }

  // Kullanıcı ID'sinden müşteri araçlarını ekleme
  async createVehicleForUser(userId: string, createVehicleDto: CreateCustomerVehicleDto) {
    const customer = await this.prisma.customers.findFirst({
      where: { user_id: userId },
    });

    if (!customer) {
      throw new NotFoundException(`Bu kullanıcı için müşteri profili bulunamadı`);
    }

    return this.createVehicle(customer.id, createVehicleDto);
  }

  // Kullanıcı ID'sinden müşteri araçlarını getirme
  async findAllVehiclesForUser(userId: string) {
    const customer = await this.prisma.customers.findFirst({
      where: { user_id: userId },
    });

    if (!customer) {
      throw new NotFoundException(`Bu kullanıcı için müşteri profili bulunamadı`);
    }

    return this.findAllVehicles(customer.id);
  }
  
  // Müşteri ID'si ile araç ekleme
  async createVehicle(
    customerId: string,
    createVehicleDto: CreateCustomerVehicleDto,
  ): Promise<CustomerVehicleResponseDto> {
    const customerExists = await this.prisma.customers.findUnique({
      where: { id: customerId },
    });

    if (!customerExists) {
      throw new NotFoundException(`${customerId} ID'li müşteri bulunamadı`);
    }

    const vehicle = await this.prisma.customer_vehicles.create({
      data: {
        id: randomUUID(),
        customer_id: customerId,
        ...createVehicleDto,
      },
      include: {
        brands: true,
        models: true,
        model_years: true,
        variants: true,
      },
    });

    return vehicle;
  }

  // Belirli bir aracı getirme
  async findOneVehicle(id: string): Promise<CustomerVehicleResponseDto> {
    const vehicle = await this.prisma.customer_vehicles.findUnique({
      where: { id },
      include: {
        brands: true,
        models: true,
        model_years: true,
        variants: true,
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`${id} ID'li araç bulunamadı`);
    }

    return vehicle;
  }

  // Belirli bir aracı güncelleme
  async updateVehicle(
    id: string,
    updateVehicleDto: UpdateCustomerVehicleDto,
  ): Promise<CustomerVehicleResponseDto> {
    // Araç var mı kontrolü
    await this.findOneVehicle(id);

    return this.prisma.customer_vehicles.update({
      where: {
        id: id,
      },
      data: {
        ...updateVehicleDto,
      },
      include: {
        brands: true,
        models: true,
        model_years: true,
        variants: true,
      },
    });
  }

  // Belirli bir aracı silme
  async removeVehicle(id: string): Promise<void> {
    await this.findOneVehicle(id);

    await this.prisma.customer_vehicles.delete({
      where: {
        id: id,
      },
    });
  }

  // Müşteri ID'si ile tüm araçları getirme
  async findAllVehicles(customerId: string): Promise<CustomerVehicleResponseDto[]> {
    const customerExists = await this.prisma.customers.findUnique({
      where: { id: customerId },
    });

    if (!customerExists) {
      throw new NotFoundException(`${customerId} ID'li müşteri bulunamadı`);
    }

    return this.prisma.customer_vehicles.findMany({
      where: {
        customer_id: customerId,
      },
      include: {
        brands: true,
        models: true,
        model_years: true,
        variants: true,
      },
    });
  }
}