import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { CampaignValidationService } from '../services/campaign-validation.service';

@Injectable()
export class CampaignOwnerGuard implements CanActivate {
  constructor(private readonly validationService: CampaignValidationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { id, mechanicId } = request.params;

    if (!id || !mechanicId) {
      throw new ForbiddenException('Kampanya veya mekanik bilgisi eksik.');
    }

    try {
      await this.validationService.validateCampaignOwnership(id, mechanicId);

      await this.validationService.validateMechanicOwnership(mechanicId, user.id);

      return true;
    } catch (error) {
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }
  }
}
