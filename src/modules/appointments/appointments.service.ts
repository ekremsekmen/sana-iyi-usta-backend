import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { GetAvailableSlotsDto } from './dto/get-available-slots.dto';
import { SlotService } from './services/slot.service';
import { AppointmentManagementService } from './services/appointment-management.service';
import { AppointmentQueryService } from './services/appointment-query.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private slotService: SlotService,
    private appointmentManagementService: AppointmentManagementService,
    private appointmentQueryService: AppointmentQueryService
  ) {}

  private async findCustomerIdByUserId(userId: string): Promise<string> {
    const customer = await this.prisma.customers.findFirst({
      where: { user_id: userId }
    });
    
    if (!customer) {
      throw new NotFoundException('Müşteri bulunamadı');
    }
    
    return customer.id;
  }

  private async findMechanicIdByUserId(userId: string): Promise<string> {
    const mechanic = await this.prisma.mechanics.findFirst({
      where: { user_id: userId }
    });
    
    if (!mechanic) {
      throw new NotFoundException('Tamirci bulunamadı');
    }
    
    return mechanic.id;
  }

  // userId kullanarak randevu oluşturma
  async createAppointmentByUser(userId: string, dto: CreateAppointmentDto) {
    const customerId = await this.findCustomerIdByUserId(userId);
    return this.appointmentManagementService.createAppointment(customerId, dto);
  }

  async getAvailableSlots(dto: GetAvailableSlotsDto) {
    return this.slotService.getAvailableSlots(dto);
  }

  // userId kullanarak müşterinin randevularını getirme
  async getCustomerAppointmentsByUser(userId: string) {
    const customerId = await this.findCustomerIdByUserId(userId);
    return this.appointmentQueryService.getCustomerAppointments(customerId);
  }

  // userId kullanarak mekanikerin randevularını getirme
  async getMechanicAppointmentsByUser(userId: string) {
    const mechanicId = await this.findMechanicIdByUserId(userId);
    return this.appointmentQueryService.getMechanicAppointments(mechanicId);
  }

  // Mevcut metotlar
  async createAppointment(customerId: string, dto: CreateAppointmentDto) {
    return this.appointmentManagementService.createAppointment(customerId, dto);
  }

  async getCustomerAppointments(customerId: string) {
    return this.appointmentQueryService.getCustomerAppointments(customerId);
  }

  async getMechanicAppointments(mechanicId: string) {
    return this.appointmentQueryService.getMechanicAppointments(mechanicId);
  }

  async cancelAppointment(userId: string, appointmentId: string, userRole: string) {
    return this.appointmentManagementService.cancelAppointment(userId, appointmentId, userRole);
  }

  async approveAppointment(mechanicUserId: string, appointmentId: string) {
    return this.appointmentManagementService.approveAppointment(mechanicUserId, appointmentId);
  }
  
  async completeAppointment(mechanicUserId: string, appointmentId: string) {
    return this.appointmentManagementService.completeAppointment(mechanicUserId, appointmentId);
  }
}
