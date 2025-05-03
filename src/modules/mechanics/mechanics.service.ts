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

  create(userId: string, createMechanicDto: MechanicProfileDto) {
    return this.mechanicProfileService.create(userId, createMechanicDto);
  }

  findOne(id: string) {
    return this.mechanicProfileService.findOne(id);
  }

  update(id: string, userId: string, updateMechanicDto: MechanicProfileDto) {
    return this.mechanicProfileService.update(id, userId, updateMechanicDto);
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

  getWorkingHourById(id: string) {
    return this.mechanicWorkingHoursService.findOne(id);
  }

  updateWorkingHours(id: string, dto: Partial<MechanicWorkingHoursDto>) {
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

  addSupportedVehicleForMechanic(mechanicId: string, dto: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[]) {
    return this.mechanicSupportedVehiclesService.addSupportedVehicleForMechanic(mechanicId, dto);
  }

  updateSupportedVehiclesForMechanic(mechanicId: string, dtoList: MechanicSupportedVehicleDto[]) {
    return this.mechanicSupportedVehiclesService.updateSupportedVehiclesForMechanic(mechanicId, dtoList);
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

  addCategoryForMechanic(mechanicId: string, dto: MechanicCategoryDto | MechanicCategoryDto[]) {
    return this.mechanicCategoriesService.createForMechanic(mechanicId, dto);
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

  updateCategoriesForMechanic(mechanicId: string, dto: MechanicCategoryDto[]) {
    dto.forEach(item => item.mechanic_id = mechanicId);
    return this.updateBulkCategories(mechanicId, dto.map(item => item.category_id));
  }

  findByUserId(userId: string) {
    return this.mechanicProfileService.findByUserId(userId);
  }
}
