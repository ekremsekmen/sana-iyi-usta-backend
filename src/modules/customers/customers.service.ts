import { Injectable } from '@nestjs/common';
import { CreateCustomerVehicleDto } from './dto/customer-vehicle.dto';
import { CustomerVehicleService } from './services/customer-vehicle.service';
import { VehicleMaintenanceRecordService } from './services/vehicle-maintenance-record.service';

@Injectable()
export class CustomersService {
  constructor(
    private customerVehicleService: CustomerVehicleService,
    private vehicleMaintenanceRecordService: VehicleMaintenanceRecordService
  ) {}

  async createVehicleForUser(userId: string, createVehicleDto: CreateCustomerVehicleDto) {
    return this.customerVehicleService.createVehicleForUser(userId, createVehicleDto);
  }

  async findAllVehiclesForUser(userId: string) {
    return this.customerVehicleService.findAllVehiclesForUser(userId);
  }

  async findVehicleForUser(userId: string, vehicleId: string) {
    return this.customerVehicleService.findVehicleForUser(userId, vehicleId);
  }

  async removeVehicleForUser(userId: string, vehicleId: string) {
    return this.customerVehicleService.removeVehicleForUser(userId, vehicleId);
  }

  async findVehicleMaintenanceRecords(userId: string, vehicleId: string) {
    return this.vehicleMaintenanceRecordService.findRecordsForVehicle(userId, vehicleId);
  }
}