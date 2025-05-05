import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateVehicleMaintenanceRecordDto } from '../dto/create-vehicle-maintenance-record.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class MechanicVehicleMaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async createMaintenanceRecord(mechanicId: string, dto: CreateVehicleMaintenanceRecordDto) {
    // Randevuyu bul
    const appointment = await this.prisma.appointments.findUnique({
      where: { id: dto.appointment_id },
      include: {
        customer_vehicles: true
      }
    });

    if (!appointment) {
      throw new NotFoundException('Randevu bulunamadı');
    }

    // Randevunun bu tamirciye ait olup olmadığını kontrol et
    if (appointment.mechanic_id !== mechanicId) {
      throw new BadRequestException('Bu randevu sizin değil');
    }

    // Randevunun durumunu kontrol et - sadece onaylanmış veya tamamlanmış randevular için bakım kaydı girilebilir
    if (appointment.status !== 'confirmed' && appointment.status !== 'completed') {
      throw new BadRequestException('Yalnızca onaylanmış veya tamamlanmış randevular için bakım kaydı girebilirsiniz');
    }

    // Bakım kaydı oluştur
    return this.prisma.vehicle_maintenance_records.create({
      data: {
        id: randomUUID(),
        vehicle_id: appointment.vehicle_id,
        mechanic_id: mechanicId,
        customer_id: appointment.customer_id,
        details: dto.details,
        cost: dto.cost,
        odometer: dto.odometer,
        next_due_date: dto.next_due_date ? new Date(dto.next_due_date) : null
      }
    });
  }

  async getMaintenanceRecordsByVehicle(mechanicId: string, vehicleId: string) {
    // Bu tamircinin bakım kayıtlarını getir
    return this.prisma.vehicle_maintenance_records.findMany({
      where: {
        vehicle_id: vehicleId,
        mechanic_id: mechanicId
      },
      orderBy: {
        service_date: 'desc'
      }
    });
  }
}
