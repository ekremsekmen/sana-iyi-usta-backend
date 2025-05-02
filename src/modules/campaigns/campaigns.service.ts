import { Injectable } from '@nestjs/common';
import { CampaignDto } from './dto/campaign.dto';
import { CampaignCreateService } from './services/campaign-create.service';
import { CampaignQueryService } from './services/campaign-query.service';
import { CampaignUpdateService } from './services/campaign-update.service';
import { CampaignDeleteService } from './services/campaign-delete.service';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly createService: CampaignCreateService,
    private readonly queryService: CampaignQueryService,
    private readonly updateService: CampaignUpdateService,
    private readonly deleteService: CampaignDeleteService
  ) {}

  async create(mechanicId: string, createCampaignDto: CampaignDto, userId: string = null) {
    return this.createService.create(mechanicId, createCampaignDto, userId);
  }

  async findAll(query: { mechanicId?: string, categoryId?: string, brandId?: string, active?: string } = {}) {
    return this.queryService.findAll(query);
  }

  async findOne(id: string) {
    return this.queryService.findOne(id);
  }

  async update(id: string, mechanicId: string, updateCampaignDto: CampaignDto, userId: string = null) {
    return this.updateService.update(id, mechanicId, updateCampaignDto, userId);
  }

  async remove(id: string, mechanicId: string, userId: string = null) {
    return this.deleteService.remove(id, mechanicId, userId);
  }

  async findByMechanic(mechanicId: string) {
    return this.queryService.findByMechanic(mechanicId);
  }
}
