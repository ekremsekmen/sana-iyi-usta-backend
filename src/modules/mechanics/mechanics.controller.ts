import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus, ForbiddenException, UsePipes, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { MechanicsService } from './mechanics.service';
import { MechanicProfileDto } from './dto/mechanic-profile.dto';
import { JwtGuard } from '../../common/guards';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MechanicSupportedVehicleDto } from './dto/mechanic-supported-vehicle.dto';
import { MechanicWorkingHoursDto } from './dto/mechanic-working-hours.dto';
import { MechanicCategoryDto } from './dto/mechanic-category.dto';

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

  @UseGuards(JwtGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body()  MechanicProfileDto:MechanicProfileDto,
    @Req() request: RequestWithUser
  ) {
    MechanicProfileDto.user_id = request.user.id;
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu kaydı güncelleme yetkiniz yok.');
    }
    return this.mechanicsService.update(id, MechanicProfileDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Req() request: RequestWithUser) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu kaydı silme yetkiniz yok.');
    }
    return this.mechanicsService.remove(id);
  }

  @UseGuards(JwtGuard)
  @Get(':id/supported-vehicles')
  @HttpCode(HttpStatus.OK)
  async getSupportedVehicles(@Param('id', new ParseUUIDPipe()) id: string, @Req() request: RequestWithUser) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu bilgileri görüntüleme yetkiniz yok.');
    }
    return this.mechanicsService.getSupportedVehicles(id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/supported-vehicles')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async addSupportedVehicle(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }

    if (Array.isArray(body)) {
      body.forEach(item => item.mechanic_id = id);
    } else {
      body.mechanic_id = id;
    }

    return this.mechanicsService.addSupportedVehicle(body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id/supported-vehicles/:brandId')
  @HttpCode(HttpStatus.OK)
  async removeSupportedVehicle(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Param('brandId', new ParseUUIDPipe()) brandId: string,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }
    
    return this.mechanicsService.removeSupportedVehicleByBrand(id, brandId);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/supported-vehicles')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async updateSupportedVehicles(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() dto: MechanicSupportedVehicleDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }
    
    // Tüm dto'ların mechanic_id'sini parametre olarak verilen id ile ayarla
    dto.forEach(item => item.mechanic_id = id);
    
    // updateBulkSupportedVehicles metoduna brand_ids yerine direkt dto dizisi gönder
    return this.mechanicsService.updateBulkSupportedVehicles(id, dto.map(item => item.brand_id));
  }

  @UseGuards(JwtGuard)
  @Get(':id/working-hours')
  @HttpCode(HttpStatus.OK)
  async getWorkingHours(@Param('id', new ParseUUIDPipe()) id: string, @Req() request: RequestWithUser) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu bilgileri görüntüleme yetkiniz yok.');
    }
    return this.mechanicsService.getWorkingHours(id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/working-hours')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async createWorkingHours(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() MechanicWorkingHoursDto: MechanicWorkingHoursDto | MechanicWorkingHoursDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }
    
    return this.mechanicsService.createWorkingHours(id, MechanicWorkingHoursDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/working-hours/:hourId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async updateWorkingHours(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('hourId', new ParseUUIDPipe()) hourId: string,
    @Body()  MechanicWorkingHoursDto: MechanicWorkingHoursDto,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }
    
    return this.mechanicsService.updateWorkingHours(hourId,MechanicWorkingHoursDto );
  }

  @UseGuards(JwtGuard)
  @Delete(':id/working-hours/:hourId')
  @HttpCode(HttpStatus.OK)
  async deleteWorkingHours(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('hourId', new ParseUUIDPipe()) hourId: string,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }
    
    return this.mechanicsService.deleteWorkingHours(hourId);
  }

  // Categories Endpoints
  @UseGuards(JwtGuard)
  @Get(':id/categories')
  @HttpCode(HttpStatus.OK)
  async getCategories(@Param('id', new ParseUUIDPipe()) id: string, @Req() request: RequestWithUser) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu bilgileri görüntüleme yetkiniz yok.');
    }
    return this.mechanicsService.getCategories(id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/categories')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async addCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: MechanicCategoryDto | MechanicCategoryDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }

    if (Array.isArray(body)) {
      body.forEach(item => item.mechanic_id = id);
    } else {
      body.mechanic_id = id;
    }

    return this.mechanicsService.addCategory(body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id/categories/:categoryId')
  @HttpCode(HttpStatus.OK)
  async removeCategory(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }
    
    return this.mechanicsService.removeCategoryByMechanicAndCategory(id, categoryId);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/categories')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async updateCategories(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() dto: MechanicCategoryDto[],
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }
    
    dto.forEach(item => item.mechanic_id = id);
    
    return this.mechanicsService.updateBulkCategories(id, dto.map(item => item.category_id));
  }
}
