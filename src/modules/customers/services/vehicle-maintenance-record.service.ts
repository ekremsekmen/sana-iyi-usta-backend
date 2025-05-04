import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CustomerValidateService } from './customer-validate.service';

@Injectable()
export class VehicleMaintenanceRecordService {
  constructor(
    private prisma: PrismaService,
    private customerValidateService: CustomerValidateService
  ) {}

  async findRecordsForVehicle(userId: string, vehicleId: string) {
    const customer = await this.customerValidateService.findCustomerByUserId(userId);
    await this.customerValidateService.verifyVehicleOwnership(customer.id, vehicleId);
    
    return this.findMaintenanceRecords(vehicleId);
  }

  private async findMaintenanceRecords(vehicleId: string) {
    // Transaction kullanarak okuma işlemi gerçekleştir
    return this.prisma.$transaction(async (prisma) => {
      const maintenanceRecords = await prisma.vehicle_maintenance_records.findMany({
        where: {
          vehicle_id: vehicleId
        },
        include: {
          mechanics: {
            select: {
              id: true,
              business_name: true
            }
          }
        },
        orderBy: {
          service_date: 'desc'
        }
      });

      return maintenanceRecords;
    });
  }
}
