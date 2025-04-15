import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto, AuthProvider } from '../dto/register.dto';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

@Injectable()
export class AuthValidationService {
  constructor(private prisma: PrismaService) {}

  async findExistingAuth(provider: string, providerId: string) {
    return this.prisma.user_auth.findFirst({
      where: {
        auth_provider: provider,
        provider_id: providerId,
      },
      include: {
        users: true,
      },
    });
  }

  async validateRegistration(registerDto: RegisterDto) {
    if (registerDto.provider_id) {
      const existingAuth = await this.findExistingAuth(
        registerDto.auth_provider,
        registerDto.provider_id,
      );
      if (existingAuth) {
        throw new ConflictException(ERROR_MESSAGES.ACCOUNT_ALREADY_EXISTS);
      }
    }

    if (
      registerDto.auth_provider === AuthProvider.LOCAL &&
      !registerDto.password
    ) {
      throw new ConflictException(ERROR_MESSAGES.PASSWORD_REQUIRED);
    }

    // KVKK onayı kontrolü
    if (!registerDto.kvkk_approved) {
      throw new BadRequestException(ERROR_MESSAGES.KVKK_APPROVAL_REQUIRED);
    }

    // Kullanım şartları kontrolü
    if (!registerDto.terms_approved) {
      throw new BadRequestException(ERROR_MESSAGES.TERMS_APPROVAL_REQUIRED);
    }
  }

  async validateUserRole(existingRole: string, newRole: string) {
    if (existingRole !== newRole) {
      throw new BadRequestException(
        ERROR_MESSAGES.ROLE_CONFLICT,
      );
    }
  }
}
