import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CampaignValidationService } from './campaign-validation.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CampaignDeleteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: CampaignValidationService
  ) {}

  async remove(id: string, mechanicId: string, userId: string) {
    try {
      await this.validationService.validateMechanicOwnership(mechanicId, userId);
      await this.validationService.validateCampaignOwnership(id, mechanicId);
      
      return await this.prisma.$transaction(async (tx) => {
        await tx.campaign_brands.deleteMany({
          where: { campaign_id: id },
        });
        
        await tx.campaign_categories.deleteMany({
          where: { campaign_id: id },
        });

        await tx.campaigns.delete({
          where: { id },
        });

        return { message: 'Kampanya başarıyla silindi' };
      });
    } catch (error) {
      this.handleErrors(error, 'Kampanya silme');
    }
  }

  private handleErrors(error: any, operation: string) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') { 
        throw new NotFoundException(`Kampanya bulunamadı veya zaten silinmiş.`);
      }
      console.error(`Prisma Hatası Kodu: ${error.code}`, error.message);
      throw new InternalServerErrorException(`Veritabanı hatası oluştu: ${error.message}`);
    }
    console.error(`${operation} sırasında hata: ${error.message}`, error.stack);
    throw error;
  }
}
