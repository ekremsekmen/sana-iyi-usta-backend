import { CanActivate, ExecutionContext } from '@nestjs/common';
import { CampaignValidationService } from '../services/campaign-validation.service';
export declare class CampaignOwnerGuard implements CanActivate {
    private readonly validationService;
    constructor(validationService: CampaignValidationService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
