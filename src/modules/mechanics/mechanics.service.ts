import { Injectable } from '@nestjs/common';
import { MechanicProfileService } from './services/mechanic-profile.service';
import { MechanicWorkingHoursService } from './services/mechanic-working-hours.service';
import { MechanicSupportedVehiclesService } from './services/mechanic-supported-vehicles.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';
import { CreateMechanicWorkingHoursDto } from './dto/create-mechanic-working-hours.dto';
import { UpdateMechanicWorkingHoursDto } from './dto/update-mechanic-working-hours.dto';
import { CreateMechanicSupportedVehicleDto } from './dto/create-mechanic-supported-vehicle.dto';

@Injectable()
export class MechanicsService {
  constructor(
    private readonly mechanicProfileService: MechanicProfileService,
    private readonly mechanicWorkingHoursService: MechanicWorkingHoursService,
    private readonly mechanicSupportedVehiclesService: MechanicSupportedVehiclesService
  ) {}

  create(createMechanicDto: CreateMechanicDto) {
    return this.mechanicProfileService.create(createMechanicDto);
  }

  findOne(id: string) {
    return this.mechanicProfileService.findOne(id);
  }

  update(id: string, updateMechanicDto: UpdateMechanicDto) {
    return this.mechanicProfileService.update(id, updateMechanicDto);
  }

  remove(id: string) {
    return this.mechanicProfileService.remove(id);
  }

  createWorkingHours(mechanicId: string, dto: CreateMechanicWorkingHoursDto) {
    dto.mechanic_id = mechanicId;
    return this.mechanicWorkingHoursService.create(dto);
  }

  getWorkingHours(mechanicId: string) {
    return this.mechanicWorkingHoursService.findByMechanic(mechanicId);
  }

  updateWorkingHours(id: string, dto: UpdateMechanicWorkingHoursDto) {
    return this.mechanicWorkingHoursService.update(id, dto);
  }

  deleteWorkingHours(id: string) {
    return this.mechanicWorkingHoursService.remove(id);
  }

  updateBulkWorkingHours(mechanicId: string, dtoList: CreateMechanicWorkingHoursDto[]) {
    return this.mechanicWorkingHoursService.createOrUpdateBulk(mechanicId, dtoList);
  }

  getSupportedVehicles(mechanicId: string) {
    return this.mechanicSupportedVehiclesService.findByMechanic(mechanicId);
  }

  addSupportedVehicle(dto: CreateMechanicSupportedVehicleDto) {
    return this.mechanicSupportedVehiclesService.create(dto);
  }

  removeSupportedVehicle(id: string) {
    return this.mechanicSupportedVehiclesService.remove(id);
  }

  removeSupportedVehicleByBrand(mechanicId: string, brandId: string) {
    return this.mechanicSupportedVehiclesService.removeByMechanicAndBrand(mechanicId, brandId);
  }

  updateBulkSupportedVehicles(mechanicId: string, brandIds: string[]) {
    return this.mechanicSupportedVehiclesService.updateBulkSupportedVehicles(mechanicId, brandIds);
  }
}
