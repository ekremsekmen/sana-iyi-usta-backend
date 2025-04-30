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
  create(@Body() MechanicProfileDto: MechanicProfileDto, @Req() request: RequestWithUser) {
    MechanicProfileDto.user_id = request.user.id;
    return this.mechanicsService.create(MechanicProfileDto);
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
    @Body() MechanicProfileDto: MechanicProfileDto,
    @Req() request: RequestWithUser
  ) {
    MechanicProfileDto.user_id = request.user.id;
    return this.mechanicsService.update(id, MechanicProfileDto);
  }

  @UseGuards(JwtGuard, MechanicOwnerGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.mechanicsService.remove(id);
  }

  @UseGuards(JwtGuard, MechanicOwnerGuard)
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
    if (Array.isArray(body)) {
      body.forEach(item => item.mechanic_id = id);
    } else {
      body.mechanic_id = id;
    }

    return this.mechanicsService.addSupportedVehicle(body);
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
    // Tüm dto'ların mechanic_id'sini parametre olarak verilen id ile ayarla
    dto.forEach(item => item.mechanic_id = id);
    
    // updateBulkSupportedVehicles metoduna brand_ids yerine direkt dto dizisi gönder
    return this.mechanicsService.updateBulkSupportedVehicles(id, dto.map(item => item.brand_id));
  }

  @UseGuards(JwtGuard, MechanicOwnerGuard)
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

  // Categories Endpoints
  @UseGuards(JwtGuard, MechanicOwnerGuard)
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
    if (Array.isArray(body)) {
      body.forEach(item => item.mechanic_id = id);
    } else {
      body.mechanic_id = id;
    }

    return this.mechanicsService.addCategory(body);
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
    dto.forEach(item => item.mechanic_id = id);
    
    return this.mechanicsService.updateBulkCategories(id, dto.map(item => item.category_id));
  }
}
