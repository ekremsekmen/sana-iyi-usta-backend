import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus, ForbiddenException, UsePipes, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { MechanicsService } from './mechanics.service';
import { MechanicProfileDto } from './dto/mechanic-profile.dto';
import { JwtGuard } from '../../common/guards';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MechanicSupportedVehicleDto } from './dto/mechanic-supported-vehicle.dto';
import { MechanicWorkingHoursDto } from './dto/mechanic-working-hours.dto';
import { MechanicCategoryDto } from './dto/mechanic-category.dto';
import { MechanicOwnerGuard } from './guards/mechanic-owner.guard';

@Controller('mechanics')
export class MechanicsController {
  constructor(
    private readonly mechanicsService: MechanicsService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  create(@Body() mechanicProfileDto: MechanicProfileDto, @Req() request: RequestWithUser) {
    return this.mechanicsService.create(request.user.id, mechanicProfileDto);
  }
  
  @UseGuards(JwtGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.mechanicsService.findOne(id);
  }

  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() mechanicProfileDto: MechanicProfileDto,
    @Req() request: RequestWithUser
  ) {
    // DTO'ya user_id eklemek yerine, controller metoduna doğrudan parametre olarak geçiyoruz
    return this.mechanicsService.update(id, request.user.id, mechanicProfileDto);
  }

  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.mechanicsService.remove(id);
  }

  @UseGuards(JwtGuard)
  @Get(':id/supported-vehicles')
  @HttpCode(HttpStatus.OK)
  getSupportedVehicles(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.mechanicsService.getSupportedVehicles(id);
  }

  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @Post(':id/supported-vehicles')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  addSupportedVehicle(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[]
  ) {
    return this.mechanicsService.addSupportedVehicleForMechanic(id, body);
  }

  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @Delete(':id/supported-vehicles/:brandId')
  @HttpCode(HttpStatus.OK)
  removeSupportedVehicle(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Param('brandId', new ParseUUIDPipe()) brandId: string
  ) {
    return this.mechanicsService.removeSupportedVehicleByBrand(id, brandId);
  }

  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @Patch(':id/supported-vehicles')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  updateSupportedVehicles(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() dto: MechanicSupportedVehicleDto[]
  ) {
    return this.mechanicsService.updateSupportedVehiclesForMechanic(id, dto);
  }

  @UseGuards(JwtGuard)
  @Get(':id/working-hours')
  @HttpCode(HttpStatus.OK)
  getWorkingHours(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.mechanicsService.getWorkingHours(id);
  }

  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @Post(':id/working-hours')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  createWorkingHours(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() MechanicWorkingHoursDto: MechanicWorkingHoursDto | MechanicWorkingHoursDto[]
  ) {
    return this.mechanicsService.createWorkingHours(id, MechanicWorkingHoursDto);
  }

  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @Patch(':id/working-hours/:hourId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  updateWorkingHours(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('hourId', new ParseUUIDPipe()) hourId: string,
    @Body() MechanicWorkingHoursDto: MechanicWorkingHoursDto
  ) {
    return this.mechanicsService.updateWorkingHours(hourId, MechanicWorkingHoursDto);
  }

  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @Delete(':id/working-hours/:hourId')
  @HttpCode(HttpStatus.OK)
  deleteWorkingHours(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('hourId', new ParseUUIDPipe()) hourId: string
  ) {
    return this.mechanicsService.deleteWorkingHours(hourId);
  }

  @UseGuards(JwtGuard)
  @Get(':id/categories')
  @HttpCode(HttpStatus.OK)
  getCategories(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.mechanicsService.getCategories(id);
  }

  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @Post(':id/categories')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  addCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: MechanicCategoryDto | MechanicCategoryDto[]
  ) {
    return this.mechanicsService.addCategoryForMechanic(id, body);
  }

  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @Delete(':id/categories/:categoryId')
  @HttpCode(HttpStatus.OK)
  removeCategory(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string
  ) {
    return this.mechanicsService.removeCategoryByMechanicAndCategory(id, categoryId);
  }

  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @Patch(':id/categories')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  updateCategories(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() dto: MechanicCategoryDto[]
  ) {
    return this.mechanicsService.updateCategoriesForMechanic(id, dto);
  }

  @UseGuards(JwtGuard)
  @Get('profile/check')
  @HttpCode(HttpStatus.OK)
  async checkMechanicProfile(@Req() request: RequestWithUser) {
    return this.mechanicsService.findByUserId(request.user.id);
  }
}
