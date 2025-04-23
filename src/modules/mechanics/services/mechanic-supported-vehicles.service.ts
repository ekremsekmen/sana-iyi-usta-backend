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
    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.mechanic_supported_vehicles.deleteMany({
          where: {
            mechanic_id: mechanicId,
          },
        });

        if (brandIds.length === 0) {
          return [];
        }

        const brands = await tx.brands.findMany({
          where: {
            id: { in: brandIds }
          },
          select: { id: true }
        });

        const foundBrandIds = brands.map(b => b.id);
        const notFoundBrandIds = brandIds.filter(id => !foundBrandIds.includes(id));

        if (notFoundBrandIds.length > 0) {
          throw new NotFoundException(`Bu ID'lere sahip markalar bulunamadı: ${notFoundBrandIds.join(', ')}`);
        }

        const createPromises = brandIds.map(brandId => 
          tx.mechanic_supported_vehicles.create({
            data: {
              id: randomUUID(),
              mechanic_id: mechanicId,
              brand_id: brandId,
            },
            include: {
              brands: true,
            }
          })
        );

        return await Promise.all(createPromises);
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Desteklenen araçları güncellerken hata: ${error.message}`);
    }
  }
}
