import { Injectable } from '@nestjs/common';
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
}
