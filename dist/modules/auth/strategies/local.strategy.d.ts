import { Strategy } from 'passport-local';
import { LocalAuthenticationService } from '../services/local-authentication.service';
declare const LocalStrategy_base: new (...args: [] | [options: import("passport-local").IStrategyOptionsWithRequest] | [options: import("passport-local").IStrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class LocalStrategy extends LocalStrategy_base {
    private localAuthService;
    constructor(localAuthService: LocalAuthenticationService);
    validate(e_mail: string, password: string): Promise<any>;
}
export {};
