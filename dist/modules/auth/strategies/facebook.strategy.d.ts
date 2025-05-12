import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
declare const FacebookStrategy_base: new (...args: [options: import("passport-facebook").StrategyOptionsWithRequest] | [options: import("passport-facebook").StrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class FacebookStrategy extends FacebookStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(_accessToken: string, _refreshToken: string, profile: Profile, done: (err: any, user: any, info?: any) => void): Promise<any>;
}
export {};
