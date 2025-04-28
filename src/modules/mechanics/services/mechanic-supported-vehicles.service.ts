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
        // Tüm marka ID'lerinin geçerli olduğunu kontrol et
        if (brandIds.length > 0) {
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
        }

        const existingRecords = await tx.mechanic_supported_vehicles.findMany({
          where: { mechanic_id: mechanicId },
          select: { id: true, brand_id: true }
        });
        
        const existingBrandIds = existingRecords.map(record => record.brand_id);
        
        const brandIdsToRemove = existingBrandIds.filter(id => !brandIds.includes(id));
        
        const brandIdsToAdd = brandIds.filter(id => !existingBrandIds.includes(id));
        
        if (brandIdsToRemove.length > 0) {
          await tx.mechanic_supported_vehicles.deleteMany({
            where: {
              mechanic_id: mechanicId,
              brand_id: { in: brandIdsToRemove }
            }
          });
        }
        
        const newRecords = brandIdsToAdd.map(brandId => ({
          id: randomUUID(),
          mechanic_id: mechanicId,
          brand_id: brandId
        }));
        
        if (newRecords.length > 0) {
          await tx.mechanic_supported_vehicles.createMany({
            data: newRecords
          });
        }
        
        return await tx.mechanic_supported_vehicles.findMany({
          where: { mechanic_id: mechanicId },
          include: { brands: true }
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Desteklenen araçları güncellerken hata: ${error.message}`);
    }
  }

  async createMultiple(mechanicId: string, brandIds: string[]) {
    try {
      return await this.prisma.$transaction(async (tx) => {
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

        // Mevcut desteklenen markaları al
        const existingRecords = await tx.mechanic_supported_vehicles.findMany({
          where: { mechanic_id: mechanicId },
          select: { brand_id: true }
        });
        
        const existingBrandIds = existingRecords.map(record => record.brand_id);
        
        // Sadece yeni eklenecek markaları filtreleyerek işlemleri optimize edelim
        const newBrandIds = brandIds.filter(id => !existingBrandIds.includes(id));
        
        // Zaten ekli olan markalar varsa bunları bildir
        const alreadyExistingBrandIds = brandIds.filter(id => existingBrandIds.includes(id));
        
        // Yeni kayıtları ekle
        const newRecords = newBrandIds.map(brandId => ({
          id: randomUUID(),
          mechanic_id: mechanicId,
          brand_id: brandId
        }));
        
        let createdRecords = [];
        if (newRecords.length > 0) {
          await tx.mechanic_supported_vehicles.createMany({
            data: newRecords
          });
          
          // Yeni eklenen kayıtları getir
          createdRecords = await tx.mechanic_supported_vehicles.findMany({
            where: { 
              mechanic_id: mechanicId,
              brand_id: { in: newBrandIds }
            },
            include: { brands: true }
          });
        }
        
        return {
          created: createdRecords,
          alreadyExisting: alreadyExistingBrandIds.length > 0 ? 
            `Bu markalar zaten ekli: ${alreadyExistingBrandIds.join(', ')}` : null
        };
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Desteklenen araçları eklerken hata: ${error.message}`);
    }
  }

  async addSupportedVehicle(dto: CreateMechanicSupportedVehicleDto) {
    if (dto.brand_ids && dto.brand_ids.length > 0) {
      return this.createMultiple(dto.mechanic_id, dto.brand_ids);
    } 
    else if (dto.brand_id) {
      return this.create({
        mechanic_id: dto.mechanic_id,
        brand_id: dto.brand_id
      });
    }
    else {
      throw new Error('En az bir marka ID\'si (brand_id veya brand_ids) belirtilmelidir.');
    }
  }
}
