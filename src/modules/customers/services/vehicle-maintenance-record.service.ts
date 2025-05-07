import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { VehicleMaintenanceRecordResponseDto } from '../dto/vehicle-maintenance-record.dto';

@Injectable()
export class VehicleMaintenanceRecordService {
  constructor(private readonly prisma: PrismaService) {}

  async findRecordsForVehicle(userId: string, vehicleId: string): Promise<VehicleMaintenanceRecordResponseDto[]> {
    // Önce kullanıcının aracını doğrula
    const vehicle = await this.prisma.customer_vehicles.findFirst({
      where: {
        id: vehicleId,
        customers: {
          user_id: userId
        }
      }
    });

    if (!vehicle) {
      throw new NotFoundException('Araç bulunamadı veya bu kullanıcıya ait değil');
    }

    // Bakım kayıtlarını getir
    const records = await this.findMaintenanceRecords(vehicleId);
    return records;
  }

  private async findMaintenanceRecords(vehicleId: string) {
    // Transaction kullanarak okuma işlemi gerçekleştir
    return this.prisma.$transaction(async (prisma) => {
      const maintenanceRecords = await prisma.vehicle_maintenance_records.findMany({
        where: {
          vehicle_id: vehicleId
        },
        include: {
          mechanics: {
            select: {
              id: true,
              business_name: true
            }
          },
          appointments: { // Randevu bilgilerini dahil et
            select: {
              appointment_date: true,
              status: true,
              appointment_type: true,
              // Daha fazla randevu bilgisi eklenebilir
              mechanics: {
                select: {
                  business_name: true
                }
              }
            }
          }
        },
        orderBy: {
          service_date: 'desc'
        }
      });

      return maintenanceRecords;
    });
  }
}