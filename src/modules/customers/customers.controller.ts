import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  UseGuards, 
  Req,
  HttpStatus,
  HttpCode,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerVehicleDto} from './dto/customer-vehicle.dto';
import { JwtGuard } from 'src/common/guards';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('vehicles')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getMyVehicles(@Req() request: RequestWithUser) {
    return this.customersService.findAllVehiclesForUser(request.user.id);
  }

  @Post('vehicles')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async addMyVehicle(
    @Body() createVehicleDto: CreateCustomerVehicleDto,
    @Req() request: RequestWithUser
  ) {
    return this.customersService.createVehicleForUser(request.user.id, createVehicleDto);
  }

  @Get('vehicles/:vehicleId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getMyVehicle(
    @Param('vehicleId', new ParseUUIDPipe()) vehicleId: string,
    @Req() request: RequestWithUser
  ) {
    return this.customersService.findVehicleForUser(request.user.id, vehicleId);
  }

  @Delete('vehicles/:vehicleId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMyVehicle(
    @Param('vehicleId', new ParseUUIDPipe()) vehicleId: string,
    @Req() request: RequestWithUser
  ) {
    return this.customersService.removeVehicleForUser(request.user.id, vehicleId);
  }

  @Get('vehicles/:vehicleId/maintenance-records')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getVehicleMaintenanceRecords(
    @Param('vehicleId', new ParseUUIDPipe()) vehicleId: string,
    @Req() request: RequestWithUser
  ) {
    return this.customersService.findVehicleMaintenanceRecords(request.user.id, vehicleId);
  }

  @Patch('vehicles/:vehicleId/photo')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('photo'))
  @HttpCode(HttpStatus.OK)
  async uploadVehiclePhoto(
    @Param('vehicleId', new ParseUUIDPipe()) vehicleId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: RequestWithUser
  ) {
    return this.customersService.uploadVehiclePhoto(request.user.id, vehicleId, file);
  }
}