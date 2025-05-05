import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request, 
  Patch, 
  Delete,
  ForbiddenException
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { GetAvailableSlotsDto } from './dto/get-available-slots.dto';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@Controller('appointments')
@UseGuards(JwtGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async createAppointment(@Request() req: RequestWithUser, @Body() dto: CreateAppointmentDto) {
    if (req.user.role !== 'customer') {
      throw new ForbiddenException('Sadece müşteriler randevu oluşturabilir');
    }
    return this.appointmentsService.createAppointmentByUser(req.user.id, dto);
  }

  @Post('mechanic-available-slots')
  async getAvailableSlots(@Body() dto: GetAvailableSlotsDto) {
    return this.appointmentsService.getAvailableSlots(dto);
  }

  @Get('customer-appointments')
  async getMyAppointments(@Request() req: RequestWithUser) {
    return this.appointmentsService.getCustomerAppointmentsByUser(req.user.id);
  }

  @Get('mechanic-appointments')
  async getMechanicAppointments(@Request() req: RequestWithUser) {
    return this.appointmentsService.getMechanicAppointmentsByUser(req.user.id);
  }

  @Patch(':id/cancel')
  async cancelAppointment(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.appointmentsService.cancelAppointment(req.user.id, id, req.user.role);
  }

  @Patch(':id/approve')
  async approveAppointment(@Request() req: RequestWithUser, @Param('id') id: string) {
    if (req.user.role !== 'mechanic') {
      throw new Error('Sadece mekanikler randevuları onaylayabilir');
    }
    return this.appointmentsService.approveAppointment(req.user.id, id);
  }
  
  @Patch(':id/complete')
  async completeAppointment(@Request() req: RequestWithUser, @Param('id') id: string) {
    if (req.user.role !== 'mechanic') {
      throw new ForbiddenException('Sadece mekanikler randevuları tamamlayabilir');
    }
    return this.appointmentsService.completeAppointment(req.user.id, id);
  }
}
