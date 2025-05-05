import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../enums/roles.enum';
import { ROLES_KEY } from '../../decorators/roles.decorator';
import { RequestWithUser } from '../../interfaces/request-with-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Eğer herhangi bir rol belirtilmemişse, herkes erişebilir
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    
    if (!user || !user.role) {
      throw new ForbiddenException('Bu işlem için yetkiniz bulunmamaktadır.');
    }

    // Kullanıcının rolü, izin verilen rollerden biri mi kontrol et
    const hasRole = requiredRoles.some(role => user.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException(`Bu işlem için '${requiredRoles.join(', ')}' rolüne sahip olmanız gerekmektedir.`);
    }
    
    return true;
  }
}
