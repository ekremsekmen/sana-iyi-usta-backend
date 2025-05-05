import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus, ForbiddenException, UsePipes, ValidationPipe, ParseUUIDPipe, NotFoundException, Query } from '@nestjs/common';
import { MechanicsService } from './mechanics.service';
import { MechanicProfileDto } from './dto/mechanic-profile.dto';
import { JwtGuard } from '../../common/guards';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MechanicSupportedVehicleDto } from './dto/mechanic-supported-vehicle.dto';
import { MechanicWorkingHoursDto } from './dto/mechanic-working-hours.dto';
import { MechanicCategoryDto } from './dto/mechanic-category.dto';
import { SearchMechanicsDto } from './dto/search-mechanics.dto';
import { CreateVehicleMaintenanceRecordDto } from './dto/create-vehicle-maintenance-record.dto';

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
  @Get()
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() request: RequestWithUser) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return mechanic.profile;
  }

  @UseGuards(JwtGuard)
  @Patch()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() mechanicProfileDto: MechanicProfileDto,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.mechanicsService.update(mechanic.profile.id, request.user.id, mechanicProfileDto);
  }

  @UseGuards(JwtGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  async remove(@Req() request: RequestWithUser) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.mechanicsService.remove(mechanic.profile.id);
  }

  @UseGuards(JwtGuard)
  @Get('supported-vehicles')
  @HttpCode(HttpStatus.OK)
  async getSupportedVehicles(@Req() request: RequestWithUser) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.mechanicsService.getSupportedVehicles(mechanic.profile.id);
  }

  @UseGuards(JwtGuard)
  @Post('supported-vehicles')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async addSupportedVehicle(
    @Body() body: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.mechanicsService.addSupportedVehicleForMechanic(mechanic.profile.id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('supported-vehicles/:brandId')
  @HttpCode(HttpStatus.OK)
  async removeSupportedVehicle(
    @Param('brandId', new ParseUUIDPipe()) brandId: string,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.mechanicsService.removeSupportedVehicleByBrand(mechanic.profile.id, brandId);
  }

  @UseGuards(JwtGuard)
  @Patch('supported-vehicles')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async updateSupportedVehicles(
    @Body() dto: MechanicSupportedVehicleDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.mechanicsService.updateSupportedVehiclesForMechanic(mechanic.profile.id, dto);
  }

  @UseGuards(JwtGuard)
  @Get('working-hours')
  @HttpCode(HttpStatus.OK)
  async getWorkingHours(@Req() request: RequestWithUser) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.mechanicsService.getWorkingHours(mechanic.profile.id);
  }

  @UseGuards(JwtGuard)
  @Post('working-hours')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async createWorkingHours(
    @Body() mechanicWorkingHoursDto: MechanicWorkingHoursDto | MechanicWorkingHoursDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.mechanicsService.createWorkingHours(mechanic.profile.id, mechanicWorkingHoursDto);
  }

  @UseGuards(JwtGuard)
  @Patch('working-hours/:hourId')
  @HttpCode(HttpStatus.OK)
  async updateWorkingHours(
    @Param('hourId', new ParseUUIDPipe()) hourId: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true })) 
    mechanicWorkingHoursDto: Partial<MechanicWorkingHoursDto>,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    
    // Find existing working hours to ensure it belongs to this mechanic
    const existingHours = await this.mechanicsService.getWorkingHourById(hourId);
    if (!existingHours || existingHours.mechanic_id !== mechanic.profile.id) {
      throw new NotFoundException('Belirtilen çalışma saati kaydı bulunamadı veya bu tamirciye ait değil.');
    }
    
    return this.mechanicsService.updateWorkingHours(hourId, mechanicWorkingHoursDto);
  }

  @UseGuards(JwtGuard)
  @Delete('working-hours/:hourId')
  @HttpCode(HttpStatus.OK)
  async deleteWorkingHours(
    @Param('hourId', new ParseUUIDPipe()) hourId: string,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    
    const existingHours = await this.mechanicsService.getWorkingHourById(hourId);
    if (!existingHours || existingHours.mechanic_id !== mechanic.profile.id) {
      throw new NotFoundException('Belirtilen çalışma saati kaydı bulunamadı veya bu tamirciye ait değil.');
    }
    
    return this.mechanicsService.deleteWorkingHours(hourId);
  }

  @UseGuards(JwtGuard)
  @Get('categories')
  @HttpCode(HttpStatus.OK)
  async getCategories(@Req() request: RequestWithUser) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.mechanicsService.getCategories(mechanic.profile.id);
  }

  @UseGuards(JwtGuard)
  @Post('categories')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async addCategory(
    @Body() body: MechanicCategoryDto | MechanicCategoryDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.mechanicsService.addCategoryForMechanic(mechanic.profile.id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('categories/:categoryId')
  @HttpCode(HttpStatus.OK)
  async removeCategory(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.mechanicsService.removeCategoryByMechanicAndCategory(mechanic.profile.id, categoryId);
  }

  @UseGuards(JwtGuard)
  @Patch('categories')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async updateCategories(
    @Body() dto: MechanicCategoryDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.mechanicsService.updateCategoriesForMechanic(mechanic.profile.id, dto);
  }

  @UseGuards(JwtGuard)
  @Get('profile/check')
  @HttpCode(HttpStatus.OK)
  async checkMechanicProfile(@Req() request: RequestWithUser) {
    return this.mechanicsService.findByUserId(request.user.id);
  }

  @UseGuards(JwtGuard)
  @Post('search')  
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchMechanics(
    @Body() searchDto: SearchMechanicsDto,
    @Req() request: RequestWithUser
  ) {
    // SearchDto'da ratingSort belirtilmişse, o değeri kullanarak arama yapacak
    return this.mechanicsService.searchMechanics(request.user.id, searchDto);
  }

  @UseGuards(JwtGuard)
  @Post('maintenance-records')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async createMaintenanceRecord(
    @Body() dto: CreateVehicleMaintenanceRecordDto,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.mechanicsService.createMaintenanceRecord(mechanic.profile.id, dto);
  }

  @UseGuards(JwtGuard)
  @Get('vehicles/:vehicleId/maintenance-records')
  @HttpCode(HttpStatus.OK)
  async getMaintenanceRecordsByVehicle(
    @Param('vehicleId', new ParseUUIDPipe()) vehicleId: string,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findByUserId(request.user.id);
    if (!mechanic.hasMechanicProfile) {
      throw new NotFoundException('Tamirci profili bulunamadı.');
    }
    return this.mechanicsService.getMaintenanceRecordsByVehicle(mechanic.profile.id, vehicleId);
  }
}
