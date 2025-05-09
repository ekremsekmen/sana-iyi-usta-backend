import { Injectable, NotFoundException } from '@nestjs/common';
import { CampaignDto } from './dto/campaign.dto';
import { CampaignCreateService } from './services/campaign-create.service';
import { CampaignQueryService } from './services/campaign-query.service';
import { CampaignUpdateService } from './services/campaign-update.service';
import { CampaignDeleteService } from './services/campaign-delete.service';
import { MechanicsService } from '../mechanics/mechanics.service';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly createService: CampaignCreateService,
    private readonly queryService: CampaignQueryService,
    private readonly updateService: CampaignUpdateService,
    private readonly deleteService: CampaignDeleteService,
    private readonly mechanicsService: MechanicsService
  ) {}

  // Tamirci profilini doğrulayan ve getiren yardımcı metot
  async validateAndGetMechanicProfile(userId: string) {
    return this.mechanicsService.validateAndGetMechanicProfile(userId);
  }

  async create(mechanicId: string, createCampaignDto: CampaignDto, userId: string) {
    return this.createService.create(mechanicId, createCampaignDto, userId);
  }

  async findByMechanic(mechanicId: string, userId: string) {
    return this.queryService.findByMechanic(mechanicId, userId);
  }

  async update(id: string, mechanicId: string, updateCampaignDto: CampaignDto, userId: string) {
    return this.updateService.update(id, mechanicId, updateCampaignDto, userId);
  }

  async remove(id: string, mechanicId: string, userId: string) {
    return this.deleteService.remove(id, mechanicId, userId);
  }
  
  async findCampaignsForCustomer(userId: string) {
    return this.queryService.findCampaignsForCustomer(userId);
  }

  async findCampaignDetails(campaignId: string) {
    return this.queryService.findCampaignDetails(campaignId);
  }

  async updateImage(id: string, mechanicId: string, file: Express.Multer.File, userId: string) {
    return this.updateService.updateImage(id, mechanicId, file, userId);
  }
}
