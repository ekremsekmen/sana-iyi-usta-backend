import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../../prisma/prisma.service';
import { GoogleAuthDto, AppleAuthDto, FacebookAuthDto } from '../dto/social-auth.dto';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

export interface SocialUserInfo {
  e_mail: string;
  full_name: string;
  provider_id: string;
  role: string;
  kvkk_approved: boolean;
  terms_approved: boolean;
}

@Injectable()
export class SocialAuthenticationService {
  constructor(private prisma: PrismaService) {}

  async authenticateWithGoogle(googleAuthDto: GoogleAuthDto) {
    try {
      // Kullanıcı zaten var mı kontrolü
      const existingUser = await this.prisma.users.findUnique({
        where: { e_mail: googleAuthDto.email },
        include: { user_auth: true },
      });

      let userInfo: SocialUserInfo;
      if (existingUser) {
        // Giriş: veritabanındaki bilgileri kullan
        userInfo = {
          e_mail: existingUser.e_mail,
          full_name: existingUser.full_name,
          provider_id: googleAuthDto.providerId,
          role: existingUser.role,
          kvkk_approved: existingUser.user_auth[0]?.kvkk_approved ?? true,
          terms_approved: existingUser.user_auth[0]?.terms_approved ?? true,
        };
      } else {
        // İlk kayıt: DTO'dan al, zorunlu kontrol
        if (
          !googleAuthDto.fullName ||
          googleAuthDto.kvkkApproved === undefined ||
          googleAuthDto.termsApproved === undefined ||
          !googleAuthDto.role
        ) {
          throw new BadRequestException('Bu hesap ile kayıt için gerekli bilgiler eksik.');
        }
        userInfo = this.mapToSocialUserInfo(
          googleAuthDto.email,
          googleAuthDto.fullName,
          googleAuthDto.providerId,
          googleAuthDto.role,
          googleAuthDto.kvkkApproved,
          googleAuthDto.termsApproved
        );
      }

      return await this.findOrCreateSocialUser(userInfo, 'google');
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(ERROR_MESSAGES.SESSION_CREATION_ERROR);
    }
  }

  async authenticateWithApple(appleAuthDto: AppleAuthDto) {
    try {
      // Kullanıcı zaten var mı kontrolü
      const existingUser = await this.prisma.users.findUnique({
        where: { e_mail: appleAuthDto.email },
        include: { user_auth: true },
      });

      let userInfo: SocialUserInfo;
      if (existingUser) {
        userInfo = {
          e_mail: existingUser.e_mail,
          full_name: existingUser.full_name,
          provider_id: appleAuthDto.providerId,
          role: existingUser.role,
          kvkk_approved: existingUser.user_auth[0]?.kvkk_approved ?? true,
          terms_approved: existingUser.user_auth[0]?.terms_approved ?? true,
        };
      } else {
        if (
          appleAuthDto.kvkkApproved === undefined ||
          appleAuthDto.termsApproved === undefined ||
          !appleAuthDto.role
        ) {
          throw new BadRequestException('Bu hesap ile kayıtlı kullanıcı bulunamadı, önce kayıt olmalısınız.');
        }
        userInfo = this.mapToSocialUserInfo(
          appleAuthDto.email,
          appleAuthDto.fullName || 'Apple User',
          appleAuthDto.providerId,
          appleAuthDto.role,
          appleAuthDto.kvkkApproved,
          appleAuthDto.termsApproved
        );
      }

      return await this.findOrCreateSocialUser(userInfo, 'icloud');
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.APPLE_AUTH_FAILED);
    }
  }

  async authenticateWithFacebook(facebookAuthDto: FacebookAuthDto) {
    try {
      // Facebook API'den kullanıcı bilgilerini doğrula
      const fbUserInfo = await axios.get(
        `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${facebookAuthDto.accessToken}`
      );

      if (fbUserInfo.data.id !== facebookAuthDto.providerId) {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Kullanıcı zaten var mı kontrolü
      const existingUser = await this.prisma.users.findUnique({
        where: { e_mail: facebookAuthDto.email },
        include: { user_auth: true },
      });

      let userInfo: SocialUserInfo;
      if (existingUser) {
        userInfo = {
          e_mail: existingUser.e_mail,
          full_name: existingUser.full_name,
          provider_id: facebookAuthDto.providerId,
          role: existingUser.role,
          kvkk_approved: existingUser.user_auth[0]?.kvkk_approved ?? true,
          terms_approved: existingUser.user_auth[0]?.terms_approved ?? true,
        };
      } else {
        if (
          !facebookAuthDto.fullName ||
          facebookAuthDto.kvkkApproved === undefined ||
          facebookAuthDto.termsApproved === undefined ||
          !facebookAuthDto.role
        ) {
          throw new BadRequestException('Bu hesap ile kayıtlı kullanıcı bulunamadı, önce kayıt olmalısınız.');
        }
        userInfo = this.mapToSocialUserInfo(
          facebookAuthDto.email,
          facebookAuthDto.fullName,
          facebookAuthDto.providerId,
          facebookAuthDto.role,
          facebookAuthDto.kvkkApproved,
          facebookAuthDto.termsApproved
        );
      }

      return await this.findOrCreateSocialUser(userInfo, 'facebook');
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(ERROR_MESSAGES.SESSION_CREATION_ERROR);
    }
  }

  /**
   * Handle general social user processing
   * @param userInfo User information from social provider
   * @param provider Social provider name (google, facebook, icloud)
   * @returns User record
   */
  async handleSocialUser(userInfo: any, provider: string) {
    if (!userInfo?.e_mail) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const socialUserInfo: SocialUserInfo = {
      e_mail: userInfo.e_mail,
      full_name: userInfo.full_name || userInfo.name || `${provider} User`,
      provider_id: userInfo.provider_id || userInfo.sub || userInfo.id,
      role: userInfo.role || 'customer',
      kvkk_approved: userInfo.kvkk_approved === undefined ? false : userInfo.kvkk_approved,
      terms_approved: userInfo.terms_approved === undefined ? false : userInfo.terms_approved,
    };

    // KVKK ve kullanım şartları onay kontrolü
    if (!socialUserInfo.kvkk_approved) {
      throw new BadRequestException(ERROR_MESSAGES.KVKK_APPROVAL_REQUIRED);
    }
    
    if (!socialUserInfo.terms_approved) {
      throw new BadRequestException(ERROR_MESSAGES.TERMS_APPROVAL_REQUIRED);
    }

    return this.findOrCreateSocialUser(socialUserInfo, provider);
  }

  /**
   * Find or create a user based on social authentication info
   * @param userInfo User information from social provider
   * @param provider Social provider name
   * @returns User record
   */
  async findOrCreateSocialUser(userInfo: SocialUserInfo, provider: string) {
    if (!userInfo?.e_mail) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // KVKK ve kullanım şartları onay kontrolü
    if (!userInfo.kvkk_approved) {
      throw new BadRequestException(ERROR_MESSAGES.KVKK_APPROVAL_REQUIRED);
    }
    
    if (!userInfo.terms_approved) {
      throw new BadRequestException(ERROR_MESSAGES.TERMS_APPROVAL_REQUIRED);
    }

    let user = await this.prisma.users.findUnique({
      where: { e_mail: userInfo.e_mail },
      include: { user_auth: true },
    });

    if (user) {
      // Rol çakışması kontrolü
      if (userInfo.role && user.role !== userInfo.role) {
        throw new ConflictException(ERROR_MESSAGES.ROLE_CONFLICT);
      }
      // Kullanıcı zaten varsa, rolü veritabanından al
      userInfo.role = user.role;
      const existingAuth = user.user_auth.find(
        (auth) => auth.auth_provider === provider && auth.provider_id === userInfo.provider_id
      );

      if (!existingAuth) {
        await this.prisma.user_auth.create({
          data: {
            user_id: user.id,
            auth_provider: provider,
            provider_id: userInfo.provider_id,
            e_mail_verified: true,
            kvkk_approved: userInfo.kvkk_approved,
            terms_approved: userInfo.terms_approved,
          },
        });
        user = await this.prisma.users.findUnique({
          where: { e_mail: userInfo.e_mail },
          include: { user_auth: true },
        });
        return user;
      } else {
        return user;
      }
    } else {
      // Yeni kullanıcı ise, role zorunlu!
      if (!userInfo.role) {
        throw new BadRequestException('Role is required for new users');
      }
      user = await this.prisma.users.create({
        data: {
          full_name: userInfo.full_name,
          e_mail: userInfo.e_mail,
          role: userInfo.role,
          profile_image: null,
          created_at: new Date(),
          user_auth: {
            create: {
              auth_provider: provider,
              provider_id: userInfo.provider_id,
              e_mail_verified: true,
              kvkk_approved: userInfo.kvkk_approved,
              terms_approved: userInfo.terms_approved,
            },
          },
        },
        include: { user_auth: true },
      });
    }

    return user;
  }

  private mapToSocialUserInfo(
    email: string,
    fullName: string,
    providerId: string,
    role: string,
    kvkkApproved: boolean,
    termsApproved: boolean
  ): SocialUserInfo {
    return {
      e_mail: email,
      full_name: fullName,
      provider_id: providerId,
      role: role,
      kvkk_approved: kvkkApproved,
      terms_approved: termsApproved,
    };
  }
}
