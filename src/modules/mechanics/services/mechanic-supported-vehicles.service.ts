import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { MechanicSupportedVehicleDto } from '../dto/mechanic-supported-vehicle.dto';

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

  async create(dto: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[]) {
    try {
      // Dizi (çoklu) araç işlemi
      if (Array.isArray(dto)) {
        if (dto.length === 0) {
          return []; // Boş dizi durumunda boş dizi döndür
        }
        
        // Tüm öğelerin aynı mechanic_id'ye sahip olduğundan emin ol
        const mechanicId = dto[0].mechanic_id;
        const hasInconsistentMechanicId = dto.some(item => item.mechanic_id !== mechanicId);
        
        if (hasInconsistentMechanicId) {
          throw new BadRequestException('Tüm desteklenen araç kayıtları aynı tamirciye ait olmalıdır.');
        }
        
        return this.createMultiple(dto[0].mechanic_id, dto.map(item => item.brand_id));
      }
      // Tekil araç işlemi
      else {
        const existingRecord = await this.prisma.mechanic_supported_vehicles.findFirst({
          where: {
            mechanic_id: dto.mechanic_id,
            brand_id: dto.brand_id,
          },
        });
    
        // Marka varlığını kontrol et
        const brand = await this.prisma.brands.findUnique({
          where: { id: dto.brand_id },
        });
    
        if (!brand) {
          throw new NotFoundException(`${dto.brand_id} ID'li marka bulunamadı.`);
        }
    
        if (existingRecord) {
          // Mevcut kaydı güncelle - tutarlılık için eklenmiştir
          return await this.prisma.mechanic_supported_vehicles.update({
            where: { id: existingRecord.id },
            data: {
              brand_id: dto.brand_id,
            },
            include: {
              brands: true,
            }
          });
        } else {
          // Yeni kayıt oluştur
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
        }
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
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
      // Boş dizi kontrolü - eğer boş dizi gönderilirse hata fırlat
      if (!brandIds || brandIds.length === 0) {
        throw new BadRequestException('En az bir desteklenen marka belirtilmelidir. Tüm markaları kaldırmak istiyorsanız, silme işlemini özel olarak gerçekleştirin.');
      }

      return await this.prisma.$transaction(async (tx) => {
        // Tüm marka ID'lerinin geçerli olduğunu kontrol et
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
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Desteklenen araçları güncellerken hata: ${error.message}`);
    }
  }

  async createMultiple(mechanicId: string, brandIds: string[]) {
    try {
      // Boş dizi kontrolü
      if (!brandIds || brandIds.length === 0) {
        throw new BadRequestException('En az bir desteklenen marka belirtilmelidir.');
      }

      return await this.prisma.$transaction(async (tx) => {
        // Tüm marka ID'lerinin geçerli olduğunu kontrol et
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
        
        // Yeni kayıtları ekle
        const newRecords = newBrandIds.map(brandId => ({
          id: randomUUID(),
          mechanic_id: mechanicId,
          brand_id: brandId
        }));
        
        // Eğer eklenecek yeni kayıt yoksa boş dizi döndür
        if (newRecords.length === 0) {
          return [];
        }
        
        // Yeni kayıtları ekle
        await tx.mechanic_supported_vehicles.createMany({
          data: newRecords
        });
        
        // Sadece yeni eklenen kayıtları döndür
        return await tx.mechanic_supported_vehicles.findMany({
          where: { 
            mechanic_id: mechanicId,
            brand_id: { in: newBrandIds }
          },
          include: { brands: true }
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Desteklenen araçları eklerken hata: ${error.message}`);
    }
  }

  async addSupportedVehicle(dto: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[]) {
    return this.create(dto);
  }

  async createForMechanic(mechanicId: string, dto: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[]) {
    if (Array.isArray(dto)) {
      const modifiedDto = dto.map(item => ({
        ...item,
        mechanic_id: mechanicId
      }));
      return this.create(modifiedDto);
    } else {
      const modifiedDto = {
        ...dto,
        mechanic_id: mechanicId
      };
      return this.create(modifiedDto);
    }
  }
}
