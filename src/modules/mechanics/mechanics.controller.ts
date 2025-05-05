import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus, ForbiddenException, UsePipes, ValidationPipe, ParseUUIDPipe, NotFoundException, Query } from '@nestjs/common';
import { MechanicsService } from './mechanics.service';
import { MechanicProfileDto } from './dto/mechanic-profile.dto';
import { JwtGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MechanicSupportedVehicleDto } from './dto/mechanic-supported-vehicle.dto';
import { MechanicWorkingHoursDto } from './dto/mechanic-working-hours.dto';
import { MechanicCategoryDto } from './dto/mechanic-category.dto';
import { SearchMechanicsDto } from './dto/search-mechanics.dto';
import { CreateVehicleMaintenanceRecordDto } from './dto/create-vehicle-maintenance-record.dto';

@Controller('mechanics')
@UseGuards(JwtGuard, RolesGuard)
export class MechanicsController {
  constructor(
    private readonly mechanicsService: MechanicsService,
  ) {}

  @Post()
  @Roles(Role.MECHANIC)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  create(@Body() mechanicProfileDto: MechanicProfileDto, @Req() request: RequestWithUser) {
    return this.mechanicsService.create(request.user.id, mechanicProfileDto);
  }
  
  @UseGuards(JwtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() request: RequestWithUser) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return mechanicProfile;
  }

  @UseGuards(JwtGuard)
  @Patch()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() mechanicProfileDto: MechanicProfileDto,
    @Req() request: RequestWithUser
  ) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return this.mechanicsService.update(mechanicProfile.id, request.user.id, mechanicProfileDto);
  }

  @UseGuards(JwtGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  async remove(@Req() request: RequestWithUser) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return this.mechanicsService.remove(mechanicProfile.id);
  }

  @UseGuards(JwtGuard)
  @Get('supported-vehicles')
  @HttpCode(HttpStatus.OK)
  async getSupportedVehicles(@Req() request: RequestWithUser) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return this.mechanicsService.getSupportedVehicles(mechanicProfile.id);
  }

  @UseGuards(JwtGuard)
  @Post('supported-vehicles')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async addSupportedVehicle(
    @Body() body: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return this.mechanicsService.addSupportedVehicleForMechanic(mechanicProfile.id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('supported-vehicles/:brandId')
  @HttpCode(HttpStatus.OK)
  async removeSupportedVehicle(
    @Param('brandId', new ParseUUIDPipe()) brandId: string,
    @Req() request: RequestWithUser
  ) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return this.mechanicsService.removeSupportedVehicleByBrand(mechanicProfile.id, brandId);
  }

  @UseGuards(JwtGuard)
  @Patch('supported-vehicles')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async updateSupportedVehicles(
    @Body() dto: MechanicSupportedVehicleDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return this.mechanicsService.updateSupportedVehiclesForMechanic(mechanicProfile.id, dto);
  }

  @UseGuards(JwtGuard)
  @Get('working-hours')
  @HttpCode(HttpStatus.OK)
  async getWorkingHours(@Req() request: RequestWithUser) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return this.mechanicsService.getWorkingHours(mechanicProfile.id);
  }

  @UseGuards(JwtGuard)
  @Post('working-hours')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async createWorkingHours(
    @Body() mechanicWorkingHoursDto: MechanicWorkingHoursDto | MechanicWorkingHoursDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return this.mechanicsService.createWorkingHours(mechanicProfile.id, mechanicWorkingHoursDto);
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
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    
    // Çalışma saati doğrulaması
    await this.mechanicsService.validateWorkingHourBelongsToMechanic(hourId, mechanicProfile.id);
    
    return this.mechanicsService.updateWorkingHours(hourId, mechanicWorkingHoursDto);
  }

  @UseGuards(JwtGuard)
  @Delete('working-hours/:hourId')
  @HttpCode(HttpStatus.OK)
  async deleteWorkingHours(
    @Param('hourId', new ParseUUIDPipe()) hourId: string,
    @Req() request: RequestWithUser
  ) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    
    // Çalışma saati doğrulaması
    await this.mechanicsService.validateWorkingHourBelongsToMechanic(hourId, mechanicProfile.id);
    
    return this.mechanicsService.deleteWorkingHours(hourId);
  }

  @UseGuards(JwtGuard)
  @Get('categories')
  @HttpCode(HttpStatus.OK)
  async getCategories(@Req() request: RequestWithUser) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return this.mechanicsService.getCategories(mechanicProfile.id);
  }

  @UseGuards(JwtGuard)
  @Post('categories')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async addCategory(
    @Body() body: MechanicCategoryDto | MechanicCategoryDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return this.mechanicsService.addCategoryForMechanic(mechanicProfile.id, body);
  }

  @UseGuards(JwtGuard)
  @Delete('categories/:categoryId')
  @HttpCode(HttpStatus.OK)
  async removeCategory(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Req() request: RequestWithUser
  ) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return this.mechanicsService.removeCategoryByMechanicAndCategory(mechanicProfile.id, categoryId);
  }

  @UseGuards(JwtGuard)
  @Patch('categories')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async updateCategories(
    @Body() dto: MechanicCategoryDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return this.mechanicsService.updateCategoriesForMechanic(mechanicProfile.id, dto);
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
    return this.mechanicsService.searchMechanics(request.user.id, searchDto);
  }

  @UseGuards(JwtGuard)
  @Post('maintenance-records')
  @Roles(Role.MECHANIC)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async createMaintenanceRecord(
    @Body() dto: CreateVehicleMaintenanceRecordDto,
    @Req() request: RequestWithUser
  ) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return this.mechanicsService.createMaintenanceRecord(mechanicProfile.id, dto);
  }

  @UseGuards(JwtGuard)
  @Get('vehicles/:vehicleId/maintenance-records')
  @HttpCode(HttpStatus.OK)
  async getMaintenanceRecordsByVehicle(
    @Param('vehicleId', new ParseUUIDPipe()) vehicleId: string,
    @Req() request: RequestWithUser
  ) {
    const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
    return this.mechanicsService.getMaintenanceRecordsByVehicle(mechanicProfile.id, vehicleId);
  }

 
  @UseGuards(JwtGuard)
  @Get('detail-by-userid/:userId')
  @HttpCode(HttpStatus.OK)
  async getMechanicDetailByUserId(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.mechanicsService.getMechanicDetailByUserId(userId);
  }
 
  @UseGuards(JwtGuard)
  @Get('detail-by-mechanicid/:mechanicId')
  @HttpCode(HttpStatus.OK)
  async getMechanicById(@Param('mechanicId', new ParseUUIDPipe()) mechanicId: string) {
    return this.mechanicsService.getMechanicDetailById(mechanicId);
  }
}
