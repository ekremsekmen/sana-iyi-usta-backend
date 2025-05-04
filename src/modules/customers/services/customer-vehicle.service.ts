import { Injectable, NotFoundException,ConflictException} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCustomerVehicleDto, CustomerVehicleResponseDto } from '../dto/customer-vehicle.dto';
import { randomUUID } from 'crypto';
import { CustomerValidateService } from './customer-validate.service';

@Injectable()
export class CustomerVehicleService {
  constructor(
    private prisma: PrismaService,
    private customerValidateService: CustomerValidateService
  ) {}

  async createVehicleForUser(userId: string, createVehicleDto: CreateCustomerVehicleDto) {
    const customer = await this.customerValidateService.findCustomerByUserId(userId);
    return this.createVehicle(customer.id, createVehicleDto);
  }

  async findAllVehiclesForUser(userId: string) {
    const customer = await this.customerValidateService.findCustomerByUserId(userId);
    return this.findAllVehicles(customer.id);
  }
  
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

    if (createVehicleDto.plate_number) {
      const existingVehicle = await this.prisma.customer_vehicles.findFirst({
        where: {
          plate_number: createVehicleDto.plate_number,
        },
      });

      if (existingVehicle) {
        throw new ConflictException(`${createVehicleDto.plate_number} plakalı araç sistemde zaten kayıtlı`);
      }
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

  async findVehicleForUser(userId: string, vehicleId: string): Promise<CustomerVehicleResponseDto> {
    const customer = await this.customerValidateService.findCustomerByUserId(userId);
    await this.customerValidateService.verifyVehicleOwnership(customer.id, vehicleId);

    return this.prisma.customer_vehicles.findFirst({
      where: { 
        id: vehicleId,
        customer_id: customer.id 
      },
      include: {
        brands: true,
        models: true,
        model_years: true,
        variants: true,
      },
    });
  }

  async removeVehicleForUser(userId: string, vehicleId: string): Promise<void> {
    const customer = await this.customerValidateService.findCustomerByUserId(userId);
    await this.customerValidateService.verifyVehicleOwnership(customer.id, vehicleId);

    await this.prisma.$transaction(async (prisma) => {
      await prisma.vehicle_maintenance_records.deleteMany({
        where: {
          vehicle_id: vehicleId,
        },
      });

      await prisma.customer_vehicles.delete({
        where: {
          id: vehicleId,
        },
      });
    });
  }
}