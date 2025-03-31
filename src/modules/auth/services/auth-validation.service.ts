import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto, AuthProvider } from '../dto/register.dto';

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
        throw new ConflictException('Account already exists');
      }
    }

    if (
      registerDto.auth_provider === AuthProvider.LOCAL &&
      !registerDto.password
    ) {
      throw new ConflictException('Password is required');
    }
  }

  async validateUserRole(existingRole: string, newRole: string) {
    if (existingRole !== newRole) {
      throw new BadRequestException(
        'Cannot register with a different role using the same email',
      );
    }
  }
}
