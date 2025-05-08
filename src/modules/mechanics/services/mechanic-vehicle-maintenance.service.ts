import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateVehicleMaintenanceRecordDto } from '../dto/create-vehicle-maintenance-record.dto';
import { randomUUID } from 'crypto';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class MechanicVehicleMaintenanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService
  ) {}

  async createMaintenanceRecord(mechanicId: string, dto: CreateVehicleMaintenanceRecordDto) {
    const appointment = await this.prisma.appointments.findUnique({
      where: { id: dto.appointment_id },
      include: {
        customer_vehicles: true,
        vehicle_maintenance_records: true,
        mechanics: true,
        customers: true
      }
    });
  
    if (!appointment) {
      throw new NotFoundException('Randevu bulunamadı');
    }
  
    if (appointment.mechanic_id !== mechanicId) {
      throw new BadRequestException('Bu randevu sizin değil');
    }
  
    if (appointment.status !== 'confirmed' && appointment.status !== 'completed') {
      throw new BadRequestException('Yalnızca onaylanmış veya tamamlanmış randevular için bakım kaydı girebilirsiniz');
    }
    
    const existingRecord = await this.prisma.vehicle_maintenance_records.findUnique({
      where: { appointment_id: dto.appointment_id }
    });
    
    if (existingRecord) {
      throw new BadRequestException('Bu randevu için zaten bir bakım kaydı oluşturulmuş');
    }
  
    // Bakım kaydı oluştur
    const maintenanceRecord = await this.prisma.vehicle_maintenance_records.create({
      data: {
        id: randomUUID(),
        vehicle_id: appointment.vehicle_id,
        mechanic_id: mechanicId,
        customer_id: appointment.customer_id,
        appointment_id: dto.appointment_id, 
        details: dto.details,
        cost: dto.cost,
        odometer: dto.odometer,
        next_due_date: dto.next_due_date ? new Date(dto.next_due_date) : null
      }
    });
    
    // Bakım kaydı bildirimini gönder
    if (maintenanceRecord) {
      try {
        await this.notificationsService.notifyMaintenanceRecordCreated(
          appointment.customers.user_id,
          appointment.vehicle_id,
          appointment.mechanics.business_name,
          dto.details
        );
      } catch (error) {
        // Bildirim gönderimindeki hata bakım kaydı oluşturmayı engellemeyecek
        console.error('Bakım kaydı bildirimi gönderilirken hata:', error);
      }
    }
    
    return maintenanceRecord;
  }

  async getMaintenanceRecordsByVehicle(mechanicId: string, vehicleId: string) {
    return this.prisma.vehicle_maintenance_records.findMany({
      where: {
        vehicle_id: vehicleId,
        mechanic_id: mechanicId
      },
      include: {
        appointments: {
          select: {
            appointment_date: true,
            status: true,
            appointment_type: true
          }
        }
      },
      orderBy: {
        service_date: 'desc'
      }
    });
  }
}
