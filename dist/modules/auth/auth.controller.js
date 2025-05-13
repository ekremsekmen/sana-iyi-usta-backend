"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const email_dto_1 = require("./dto/email.dto");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const login_dto_1 = require("./dto/login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const guards_1 = require("../../common/guards");
const throttler_1 = require("@nestjs/throttler");
const social_auth_dto_1 = require("./dto/social-auth.dto");
const password_dto_1 = require("./dto/password.dto");
const fcm_token_dto_1 = require("./dto/fcm-token.dto");
const email_verification_success_template_1 = require("../../templates/email-verification-success.template");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        return await this.authService.register(registerDto);
    }
    async verifyEmail(verifyEmailDto, req, res) {
        const result = await this.authService.verifyEmail(verifyEmailDto);
        const userAgent = req.headers['user-agent'] || '';
        const isBrowser = /Mozilla|Chrome|Safari|Firefox|Edge/i.test(userAgent);
        if (isBrowser) {
            return res.send((0, email_verification_success_template_1.getEmailVerificationSuccessTemplate)());
        }
        return res.json(result);
    }
    async login(loginDto, request) {
        return this.authService.login(loginDto, request);
    }
    async refreshToken(refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refresh_token);
    }
    async logout(request, refreshTokenDto) {
        return this.authService.logout(request.user.id, refreshTokenDto.refresh_token);
    }
    async googleMobileAuth(googleAuthDto, req) {
        return this.authService.googleMobileLogin(googleAuthDto, req);
    }
    async appleMobileAuth(appleAuthDto, req) {
        return this.authService.appleMobileLogin(appleAuthDto, req);
    }
    async facebookMobileAuth(facebookAuthDto, req) {
        return this.authService.facebookMobileLogin(facebookAuthDto, req);
    }
    async forgotPassword(dto) {
        return this.authService.initiatePasswordReset(dto.email);
    }
    async verifyResetCode(dto) {
        return this.authService.verifyPasswordResetCode(dto.email, dto.code);
    }
    async resetPassword(dto) {
        return this.authService.resetPassword(dto.email, dto.code, dto.newPassword);
    }
    async changePassword(request, dto) {
        return this.authService.changePassword(request.user.id, dto);
    }
    async updateFcmToken(request, updateFcmTokenDto) {
        return this.authService.updateFcmToken(request.user.id, updateFcmTokenDto.fcm_token);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('verify-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dto_1.VerifyEmailDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('google/mobile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [social_auth_dto_1.GoogleAuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleMobileAuth", null);
__decorate([
    (0, common_1.Post)('apple/mobile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [social_auth_dto_1.AppleAuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "appleMobileAuth", null);
__decorate([
    (0, common_1.Post)('facebook/mobile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [social_auth_dto_1.FacebookAuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebookMobileAuth", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_dto_1.RequestPasswordResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('verify-reset-code'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_dto_1.VerifyResetCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyResetCode", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_dto_1.ResetPasswordWithCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Post)('change-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Post)('update-fcm-token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fcm_token_dto_1.UpdateFcmTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateFcmToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map