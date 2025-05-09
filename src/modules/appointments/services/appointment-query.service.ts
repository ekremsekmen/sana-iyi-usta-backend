import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AppointmentQueryService {
  constructor(private prisma: PrismaService) {}

  // Müşterinin kendi randevularını listele
  async getCustomerAppointments(customerId: string) {
    return this.prisma.appointments.findMany({
      where: {
        customer_id: customerId,
      },
      include: {
        mechanics: {
          include: {
            users: true,
          },
        },
        locations: true,
        customer_vehicles: {
          include: {
            brands: true,
            models: true,
          },
        },
      },
      orderBy: {
        start_time: 'asc',
      },
    });
  }

  async getMechanicAppointments(mechanicId: string) {
    return this.prisma.appointments.findMany({
      where: {
        mechanic_id: mechanicId,
      },
      include: {
        customers: {
          include: {
            users: true,
          },
        },
        locations: true,
        customer_vehicles: {
          include: {
            brands: true,
            models: true,
          },
        },
      },
      orderBy: {
        start_time: 'asc',
      },
    });
  }

  async getAppointmentById(appointmentId: string, userId: string, userRole: string) {
    const appointment = await this.prisma.appointments.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        mechanics: {
          include: {
            users: {
              select: {
                id: true,
                full_name: true,
                profile_image: true,
                phone_number: true,
              },
            },
          },
        },
        customers: {
          include: {
            users: {
              select: {
                id: true,
                full_name: true,
                profile_image: true,
                phone_number: true,
              },
            },
          },
        },
        locations: true,
        customer_vehicles: {
          include: {
            brands: true,
            models: true,
            variants: true,
            model_years: true,
            
          },
        },
        // Sadece randevuya ait bakım kaydını getir
        vehicle_maintenance_records: true,
        ratings_reviews: true,
      },
    });
  
    if (!appointment) {
      throw new NotFoundException('Randevu bulunamadı');
    }
  
    // Yetki kontrolü - kullanıcı bu randevuyu görüntüleme hakkına sahip olmalı
    const isMechanic = userRole === 'mechanic' && appointment.mechanics.users.id === userId;
    const isCustomer = userRole === 'customer' && appointment.customers.users.id === userId;
  
    if (!isMechanic && !isCustomer) {
      throw new ForbiddenException('Bu randevuyu görüntüleme yetkiniz yok');
    }
  
    return appointment;
  }
}
