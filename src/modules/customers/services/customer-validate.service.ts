import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerValidateService {
  constructor(private prisma: PrismaService) {}

  /**
   * Kullanıcı ID'sine göre müşteri kaydını bulur
   * @param userId Kullanıcı ID'si
   * @returns Müşteri kaydı
   * @throws NotFoundException - Müşteri bulunamazsa
   */
  async findCustomerByUserId(userId: string) {
    const customer = await this.prisma.customers.findFirst({
      where: { user_id: userId }
    });

    if (!customer) {
      throw new NotFoundException('Bu kullanıcı için müşteri profili bulunamadı');
    }

    return customer;
  }

  /**
   * Aracın belirtilen müşteriye ait olup olmadığını doğrular
   * @param customerId Müşteri ID'si
   * @param vehicleId Araç ID'si
   * @returns Araç kaydı
   * @throws NotFoundException - Araç bulunamazsa veya müşteriye ait değilse
   */
  async verifyVehicleOwnership(customerId: string, vehicleId: string) {
    const vehicle = await this.prisma.customer_vehicles.findFirst({
      where: {
        id: vehicleId,
        customer_id: customerId
      }
    });

    if (!vehicle) {
      throw new NotFoundException('Araç bulunamadı veya bu müşteriye ait değil');
    }

    return vehicle;
  }
}
