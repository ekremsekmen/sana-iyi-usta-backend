import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LocalAuthenticationService } from '../services/local-authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private localAuthService: LocalAuthenticationService) {
    super({
      usernameField: 'e_mail',
      passwordField: 'password',
    });
  }

  async validate(e_mail: string, password: string): Promise<any> {
    try {
      return await this.localAuthService.authenticateUser(e_mail, password);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
