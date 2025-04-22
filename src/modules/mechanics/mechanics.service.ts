import { Injectable } from '@nestjs/common';
import { MechanicProfileService } from './services/mechanic-profile.service';
import { MechanicWorkingHoursService } from './services/mechanic-working-hours.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';
import { CreateMechanicWorkingHoursDto } from './dto/create-mechanic-working-hours.dto';
import { UpdateMechanicWorkingHoursDto } from './dto/update-mechanic-working-hours.dto';

@Injectable()
export class MechanicsService {
  constructor(
    private readonly mechanicProfileService: MechanicProfileService,
    private readonly mechanicWorkingHoursService: MechanicWorkingHoursService
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
}
