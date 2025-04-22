import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { CreateMechanicSupportedVehicleDto } from '../dto/create-mechanic-supported-vehicle.dto';

@Injectable()
export class MechanicSupportedVehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByMechanic(mechanicId: string) {
    const supportedVehicles = await this.prisma.mechanic_supported_vehicles.findMany({
      where: { mechanic_id: mechanicId },
      include: {
        brands: true,
      },
    });

    return supportedVehicles;
  }

  async create(dto: CreateMechanicSupportedVehicleDto) {
    try {
      const existingRecord = await this.prisma.mechanic_supported_vehicles.findFirst({
        where: {
          mechanic_id: dto.mechanic_id,
          brand_id: dto.brand_id,
        },
      });

      if (existingRecord) {
        throw new ConflictException('Bu marka zaten tamircinin desteklediği araçlar listesinde mevcut.');
      }

      const brand = await this.prisma.brands.findUnique({
        where: { id: dto.brand_id },
      });

      if (!brand) {
        throw new NotFoundException(`${dto.brand_id} ID'li marka bulunamadı.`);
      }

      return await this.prisma.mechanic_supported_vehicles.create({
        data: {
          id: randomUUID(),
          mechanic_id: dto.mechanic_id,
          brand_id: dto.brand_id,
        },
        include: {
          brands: true,
        }
      });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Desteklenen araç kaydı oluşturulurken hata: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.mechanic_supported_vehicles.delete({
        where: { id },
        include: {
          brands: true,
        }
      });
    } catch (error) {
      throw new NotFoundException(`${id} ID'li desteklenen araç kaydı bulunamadı.`);
    }
  }

  async removeByMechanicAndBrand(mechanicId: string, brandId: string) {
    const record = await this.prisma.mechanic_supported_vehicles.findFirst({
      where: {
        mechanic_id: mechanicId,
        brand_id: brandId,
      },
    });

    if (!record) {
      throw new NotFoundException('Bu tamirci için bu marka kaydı bulunamadı.');
    }

    return this.remove(record.id);
  }

  async updateBulkSupportedVehicles(mechanicId: string, brandIds: string[]) {
    await this.prisma.mechanic_supported_vehicles.deleteMany({
      where: {
        mechanic_id: mechanicId,
      },
    });

    const results = [];
    for (const brandId of brandIds) {
      const result = await this.create({
        mechanic_id: mechanicId,
        brand_id: brandId,
      });
      results.push(result);
    }

    return results;
  }
}
