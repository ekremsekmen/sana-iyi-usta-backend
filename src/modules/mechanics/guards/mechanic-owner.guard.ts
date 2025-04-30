import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MechanicsService } from '../mechanics.service';

@Injectable()
export class MechanicOwnerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly mechanicsService: MechanicsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;
    
    if (!params.id) {
      return true;
    }

    try {
      const mechanic = await this.mechanicsService.findOne(params.id);
      
      if (!mechanic || mechanic.user_id !== user.id) {
        throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
      }
      
      request.mechanic = mechanic;
      
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
    }
  }
}
