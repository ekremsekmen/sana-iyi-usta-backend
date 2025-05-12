declare const AppleStrategy_base: new (...args: [options: import("passport-apple").AuthenticateOptionsWithRequest] | [options: import("passport-apple").AuthenticateOptions]) => import("passport-apple") & {
    validate(...args: any[]): unknown;
};
export declare class AppleStrategy extends AppleStrategy_base {
    constructor();
    validate(req: any, _accessToken: string, _refreshToken: string, _idToken: string, profile: any, done: Function): Promise<any>;
}
export {};
