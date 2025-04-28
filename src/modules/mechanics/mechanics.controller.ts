import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus, ForbiddenException, UsePipes, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { MechanicsService } from './mechanics.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';
import { JwtGuard } from '../../common/guards';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { BulkUpdateSupportedVehiclesDto } from './dto/bulk-update-supported-vehicles.dto';
import { CreateMechanicSupportedVehicleDto } from './dto/create-mechanic-supported-vehicle.dto';
import { CreateMechanicWorkingHoursDto } from './dto/create-mechanic-working-hours.dto';
import { UpdateMechanicWorkingHoursDto } from './dto/update-mechanic-working-hours.dto';
import { CreateMechanicCategoryDto } from './dto/create-mechanic-category.dto';
import { BulkUpdateCategoriesDto } from './dto/bulk-update-categories.dto';

@Controller('mechanics')
export class MechanicsController {
  constructor(
    private readonly mechanicsService: MechanicsService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMechanicDto: CreateMechanicDto, @Req() request: RequestWithUser) {
    createMechanicDto.user_id = request.user.id;
    return this.mechanicsService.create(createMechanicDto);
  }

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
    @Body() updateMechanicDto: UpdateMechanicDto,
    @Req() request: RequestWithUser
  ) {
    updateMechanicDto.user_id = request.user.id;
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu kaydı güncelleme yetkiniz yok.');
    }
    return this.mechanicsService.update(id, updateMechanicDto);
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

  // Supported Vehicles Endpoints
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
    @Body('brand_id', new ParseUUIDPipe()) brandId: string,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }

    const dto: CreateMechanicSupportedVehicleDto = {
      mechanic_id: id,
      brand_id: brandId
    };

    return this.mechanicsService.addSupportedVehicle(dto);
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
    @Body() dto: BulkUpdateSupportedVehiclesDto,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }
    
    return this.mechanicsService.updateBulkSupportedVehicles(id, dto.brand_ids);
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
    @Body() createWorkingHoursDto: CreateMechanicWorkingHoursDto,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }
    
    return this.mechanicsService.createWorkingHours(id, createWorkingHoursDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/working-hours/:hourId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async updateWorkingHours(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('hourId', new ParseUUIDPipe()) hourId: string,
    @Body() updateWorkingHoursDto: UpdateMechanicWorkingHoursDto,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }
    
    return this.mechanicsService.updateWorkingHours(hourId, updateWorkingHoursDto);
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
    @Body('category_id', new ParseUUIDPipe()) categoryId: string,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }

    const dto: CreateMechanicCategoryDto = {
      mechanic_id: id,
      category_id: categoryId
    };

    return this.mechanicsService.addCategory(dto);
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
    @Body() dto: BulkUpdateCategoriesDto,
    @Req() request: RequestWithUser
  ) {
    const mechanic = await this.mechanicsService.findOne(id);
    if (mechanic.user_id !== request.user.id) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }
    
    return this.mechanicsService.updateBulkCategories(id, dto.category_ids);
  }
}
