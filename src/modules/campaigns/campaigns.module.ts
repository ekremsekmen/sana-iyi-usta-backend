import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { MechanicsModule } from '../mechanics/mechanics.module';
import { CampaignCreateService } from './services/campaign-create.service';
import { CampaignQueryService } from './services/campaign-query.service';
import { CampaignUpdateService } from './services/campaign-update.service';
import { CampaignDeleteService } from './services/campaign-delete.service';
import { CampaignValidationService } from './services/campaign-validation.service';

@Module({
  imports: [PrismaModule, MechanicsModule], 
  controllers: [CampaignsController],
  providers: [
    CampaignsService,
    CampaignValidationService,
    CampaignCreateService,
    CampaignQueryService,
    CampaignUpdateService,
    CampaignDeleteService
  ],
  exports: [CampaignsService]
})
export class CampaignsModule {}
