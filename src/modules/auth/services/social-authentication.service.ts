import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import axios from 'axios';
import { PrismaService } from '../../../prisma/prisma.service';
import { GoogleAuthDto, AppleAuthDto, FacebookAuthDto } from '../dto/social-auth.dto';


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
      // Google API'den kullanıcı bilgilerini doğrula
      const googleUserInfo = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        {
          headers: { Authorization: `Bearer ${googleAuthDto.accessToken}` },
        }
      );

      if (googleUserInfo.data.sub !== googleAuthDto.providerId) {
        throw new UnauthorizedException('Invalid Google credentials');
      }

      // Standart SocialUserInfo nesnesine dönüştür
      const userInfo = this.mapToSocialUserInfo(
        googleAuthDto.email,
        googleAuthDto.fullName,
        googleAuthDto.providerId,
        googleAuthDto.role,
        googleAuthDto.kvkkApproved,
        googleAuthDto.termsApproved
      );

      return await this.findOrCreateSocialUser(userInfo, 'google');
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Failed to authenticate with Google');
    }
  }

  async authenticateWithApple(appleAuthDto: AppleAuthDto) {
    try {
      // Apple için doğrulama daha basit
      const userInfo = this.mapToSocialUserInfo(
        appleAuthDto.email,
        appleAuthDto.fullName || 'Apple User',
        appleAuthDto.providerId,
        appleAuthDto.role,
        appleAuthDto.kvkkApproved,
        appleAuthDto.termsApproved
      );

      return await this.findOrCreateSocialUser(userInfo, 'icloud');
    } catch (error) {
      throw new BadRequestException('Failed to authenticate with Apple');
    }
  }

  async authenticateWithFacebook(facebookAuthDto: FacebookAuthDto) {
    try {
      // Facebook API'den kullanıcı bilgilerini doğrula
      const fbUserInfo = await axios.get(
        `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${facebookAuthDto.accessToken}`
      );

      if (fbUserInfo.data.id !== facebookAuthDto.providerId) {
        throw new UnauthorizedException('Invalid Facebook credentials');
      }

      // Standart SocialUserInfo nesnesine dönüştür
      const userInfo = this.mapToSocialUserInfo(
        facebookAuthDto.email,
        facebookAuthDto.fullName,
        facebookAuthDto.providerId,
        facebookAuthDto.role,
        facebookAuthDto.kvkkApproved,
        facebookAuthDto.termsApproved
      );

      return await this.findOrCreateSocialUser(userInfo, 'facebook');
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Failed to authenticate with Facebook');
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
      throw new BadRequestException('Invalid social authentication data: Email required');
    }

    const socialUserInfo: SocialUserInfo = {
      e_mail: userInfo.e_mail,
      full_name: userInfo.full_name || userInfo.name || `${provider} User`,
      provider_id: userInfo.provider_id || userInfo.sub || userInfo.id,
      role: userInfo.role || 'CUSTOMER',
      kvkk_approved: userInfo.kvkk_approved || true,
      terms_approved: userInfo.terms_approved || true,
    };

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
      throw new BadRequestException('Invalid social authentication data');
    }

    let user = await this.prisma.users.findUnique({
      where: { e_mail: userInfo.e_mail },
      include: { user_auth: true },
    });

    if (user) {
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
            kvkk_approved: userInfo.kvkk_approved || true,
            terms_approved: userInfo.terms_approved || true,
          },
        });
      }
    } else {
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
              kvkk_approved: userInfo.kvkk_approved || true,
              terms_approved: userInfo.terms_approved || true,
            },
          },
        },
        include: { user_auth: true },
      });
    }

    return user;
  }

  // Yardımcı metot - sosyal kullanıcı bilgilerini standartlaştırma
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
