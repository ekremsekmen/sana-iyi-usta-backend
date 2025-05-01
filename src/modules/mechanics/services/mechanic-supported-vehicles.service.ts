import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
        
        const mechanicId = dto[0].mechanic_id;
        const hasInconsistentMechanicId = dto.some(item => item.mechanic_id !== mechanicId);
        
        if (hasInconsistentMechanicId) {
          throw new BadRequestException('Tüm desteklenen araç kayıtları aynı tamirciye ait olmalıdır.');
        }
        
        return this.createMultiple(dto[0].mechanic_id, dto.map(item => item.brand_id));
      }
      // Tekil araç işlemi - upsert kullanarak optimize edildi
      else {
        // Marka varlığını kontrol et
        const brand = await this.prisma.brands.findUnique({
          where: { id: dto.brand_id },
        });
    
        if (!brand) {
          throw new NotFoundException(`${dto.brand_id} ID'li marka bulunamadı.`);
        }
    
        // Upsert: Kayıt varsa güncelle, yoksa oluştur (tek sorguda)
        return await this.prisma.mechanic_supported_vehicles.upsert({
          where: {
            mechanic_id_brand_id: {  // Düzeltildi: unique_mechanic_brand yerine Prisma'nın desteklediği format kullanıldı
              mechanic_id: dto.mechanic_id,
              brand_id: dto.brand_id
            }
          },
          update: {}, // Kayıt zaten varsa hiçbir şey değiştirmiyoruz
          create: {
            id: randomUUID(),
            mechanic_id: dto.mechanic_id,
            brand_id: dto.brand_id,
          },
          include: {
            brands: true,
          }
        });
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      // Genel Error yerine InternalServerErrorException kullanıldı
      console.error(`Desteklenen araç kaydı oluşturulurken hata: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Desteklenen araç kaydı oluşturulurken bir sunucu hatası oluştu: ${error.message}`);
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
      // Genel Error yerine InternalServerErrorException kullanıldı
      console.error(`Desteklenen araçları güncellerken hata: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Desteklenen araçları güncellerken bir sunucu hatası oluştu: ${error.message}`);
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
  
        // Upsert kullanarak tüm markalar için tek bir döngüde işlem yapma
        const results = await Promise.all(
          brandIds.map(brandId => 
            tx.mechanic_supported_vehicles.upsert({
              where: {
                mechanic_id_brand_id: {  // Düzeltildi: unique_mechanic_brand yerine doğru format
                  mechanic_id: mechanicId,
                  brand_id: brandId
                }
              },
              update: {}, // Eğer varsa, hiçbir şey değiştirme
              create: {
                id: randomUUID(),
                mechanic_id: mechanicId,
                brand_id: brandId
              },
              include: { brands: true }
            })
          )
        );
        
        return results;
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      // Genel Error yerine InternalServerErrorException kullanıldı
      console.error(`Desteklenen araçları eklerken hata: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Desteklenen araçları eklerken bir sunucu hatası oluştu: ${error.message}`);
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

  // Controllerdan taşınan iş mantığı için yeni metod
  async addSupportedVehicleForMechanic(mechanicId: string, body: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[]) {
    if (Array.isArray(body)) {
      body.forEach(item => item.mechanic_id = mechanicId);
    } else {
      body.mechanic_id = mechanicId;
    }

    return this.addSupportedVehicle(body);
  }

  // Controllerdan taşınan iş mantığı için yeni metod
  async updateSupportedVehiclesForMechanic(mechanicId: string, dtoList: MechanicSupportedVehicleDto[]) {
    // Tüm dto'ların mechanic_id'sini parametre olarak verilen id ile ayarla
    dtoList.forEach(item => item.mechanic_id = mechanicId);
    
    // Brand ID'leri map ederek bulk update metoduna gönder
    return this.updateBulkSupportedVehicles(mechanicId, dtoList.map(item => item.brand_id));
  }
}
