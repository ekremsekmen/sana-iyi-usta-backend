import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put, 
  UseGuards, 
  Req,
  HttpStatus,
  HttpCode,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerVehicleDto, UpdateCustomerVehicleDto } from './dto/customer-vehicle.dto';
import { JwtGuard } from 'src/common/guards';
import { CustomerOwnerGuard } from './guards/customer-owner.guard';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('profile')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getMyProfile(@Req() request: RequestWithUser) {
    return this.customersService.findByUserId(request.user.id);
  }

  @Get(':id/vehicles')
  @UseGuards(JwtGuard, CustomerOwnerGuard)
  @HttpCode(HttpStatus.OK)
  async getVehicles(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.customersService.findAllVehicles(id);
  }

  @Post(':id/vehicles')
  @UseGuards(JwtGuard, CustomerOwnerGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async addVehicle(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() createVehicleDto: CreateCustomerVehicleDto
  ) {
    return this.customersService.createVehicle(id, createVehicleDto);
  }

  @Get(':id/vehicles/:vehicleId')
  @UseGuards(JwtGuard, CustomerOwnerGuard)
  @HttpCode(HttpStatus.OK)
  async getVehicle(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('vehicleId', new ParseUUIDPipe()) vehicleId: string
  ) {
    return this.customersService.findOneVehicle(vehicleId);
  }

  @Put(':id/vehicles/:vehicleId')
  @UseGuards(JwtGuard, CustomerOwnerGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async updateVehicle(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('vehicleId', new ParseUUIDPipe()) vehicleId: string,
    @Body() updateVehicleDto: UpdateCustomerVehicleDto
  ) {
    return this.customersService.updateVehicle(vehicleId, updateVehicleDto);
  }

  @Delete(':id/vehicles/:vehicleId')
  @UseGuards(JwtGuard, CustomerOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteVehicle(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('vehicleId', new ParseUUIDPipe()) vehicleId: string
  ) {
    return this.customersService.removeVehicle(vehicleId);
  }
}