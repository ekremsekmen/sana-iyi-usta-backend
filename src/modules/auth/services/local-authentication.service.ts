import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

@Injectable()
export class LocalAuthenticationService {
  constructor(private prisma: PrismaService) {}

  async authenticateUser(e_mail: string, password: string) {
    const user = await this.prisma.users.findUnique({
      where: { e_mail },
      include: {
        user_auth: {
          where: { auth_provider: 'local' },
          select: { password_hash: true, e_mail_verified: true },
        },
      },
    });

    if (!user || !user.user_auth.length) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const userAuth = user.user_auth[0];

    if (!userAuth.password_hash || !await bcrypt.compare(password, userAuth.password_hash)) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!userAuth.e_mail_verified) {
      throw new UnauthorizedException(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const { user_auth, ...userWithoutAuth } = user;
    return userWithoutAuth;
  }
}
