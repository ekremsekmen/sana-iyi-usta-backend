import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    super({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION,
      callbackURL: process.env.APPLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['email', 'name'],
    });
  }

  async validate(
    req: any,
    _accessToken: string,
    _refreshToken: string,
    _idToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    const userData = req.body.user ? JSON.parse(req.body.user) : {};
    
    const user = {
      full_name: userData.name ? `${userData.name.firstName} ${userData.name.lastName}` : 'Apple User',
      e_mail: profile.email,
      auth_provider: 'icloud',
      provider_id: profile.sub || _idToken,
    };
    
    done(null, user);
  }
}
