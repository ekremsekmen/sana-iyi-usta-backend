import { Injectable } from '@nestjs/common';
import { MechanicProfileService } from './services/mechanic-profile.service';
import { MechanicWorkingHoursService } from './services/mechanic-working-hours.service';
import { MechanicSupportedVehiclesService } from './services/mechanic-supported-vehicles.service';
import { MechanicCategoriesService } from './services/mechanic-categories.service';
import { MechanicProfileDto } from './dto/mechanic-profile.dto';
import { MechanicWorkingHoursDto } from './dto/mechanic-working-hours.dto';
import { MechanicSupportedVehicleDto } from './dto/mechanic-supported-vehicle.dto';
import { MechanicCategoryDto } from './dto/mechanic-category.dto';

@Injectable()
export class MechanicsService {
  constructor(
    private readonly mechanicProfileService: MechanicProfileService,
    private readonly mechanicWorkingHoursService: MechanicWorkingHoursService,
    private readonly mechanicSupportedVehiclesService: MechanicSupportedVehiclesService,
    private readonly mechanicCategoriesService: MechanicCategoriesService
  ) {}

  create(createMechanicDto: MechanicProfileDto) {
    return this.mechanicProfileService.create(createMechanicDto);
  }

  findOne(id: string) {
    return this.mechanicProfileService.findOne(id);
  }

  update(id: string, updateMechanicDto: MechanicProfileDto) {
    return this.mechanicProfileService.update(id, updateMechanicDto);
  }

  remove(id: string) {
    return this.mechanicProfileService.remove(id);
  }

  createWorkingHours(mechanicId: string, dto: MechanicWorkingHoursDto | MechanicWorkingHoursDto[]) {
    return this.mechanicWorkingHoursService.createForMechanic(mechanicId, dto);
  }

  getWorkingHours(mechanicId: string) {
    return this.mechanicWorkingHoursService.findByMechanic(mechanicId);
  }

  updateWorkingHours(id: string, dto: MechanicWorkingHoursDto) {
    return this.mechanicWorkingHoursService.update(id, dto);
  }

  deleteWorkingHours(id: string) {
    return this.mechanicWorkingHoursService.remove(id);
  }

  updateBulkWorkingHours(mechanicId: string, dtoList: MechanicWorkingHoursDto[]) {
    return this.mechanicWorkingHoursService.createOrUpdateBulk(mechanicId, dtoList);
  }

  getSupportedVehicles(mechanicId: string) {
    return this.mechanicSupportedVehiclesService.findByMechanic(mechanicId);
  }

  addSupportedVehicle(dto: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[]) {
    return this.mechanicSupportedVehiclesService.addSupportedVehicle(dto);
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

  getCategories(mechanicId: string) {
    return this.mechanicCategoriesService.findByMechanic(mechanicId);
  }

  addCategory(dto: MechanicCategoryDto | MechanicCategoryDto[]) {
    return this.mechanicCategoriesService.create(dto);
  }

  removeCategory(id: string) {
    return this.mechanicCategoriesService.remove(id);
  }

  removeCategoryByMechanicAndCategory(mechanicId: string, categoryId: string) {
    return this.mechanicCategoriesService.removeByMechanicAndCategory(mechanicId, categoryId);
  }

  updateBulkCategories(mechanicId: string, categoryIds: string[]) {
    return this.mechanicCategoriesService.updateBulkCategories(mechanicId, categoryIds);
  }
}
