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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const auth_validation_service_1 = require("./services/auth-validation.service");
const user_registration_service_1 = require("./services/user-registration.service");
const local_authentication_service_1 = require("./services/local-authentication.service");
const social_authentication_service_1 = require("./services/social-authentication.service");
const user_session_service_1 = require("./services/user-session.service");
const password_service_1 = require("./services/password.service");
const token_manager_service_1 = require("./services/token-manager.service");
const email_service_1 = require("./services/email.service");
let AuthService = class AuthService {
    constructor(registrationService, authValidationService, localAuthService, socialAuthService, userSessionService, passwordService, tokenManager, emailService) {
        this.registrationService = registrationService;
        this.authValidationService = authValidationService;
        this.localAuthService = localAuthService;
        this.socialAuthService = socialAuthService;
        this.userSessionService = userSessionService;
        this.passwordService = passwordService;
        this.tokenManager = tokenManager;
        this.emailService = emailService;
    }
    async register(registerDto) {
        await this.authValidationService.validateRegistration(registerDto);
        return this.registrationService.registerUser(registerDto);
    }
    async validateUser(e_mail, password) {
        return this.localAuthService.authenticateUser(e_mail, password);
    }
    async login(loginDto, request) {
        const user = await this.localAuthService.authenticateUser(loginDto.e_mail, loginDto.password);
        return this.userSessionService.createUserSession(user, request);
    }
    async socialLogin(userInfo, provider, request) {
        const user = await this.socialAuthService.handleSocialUser(userInfo, provider);
        return this.userSessionService.createUserSession(user, request);
    }
    async googleMobileLogin(googleAuthDto, request) {
        const user = await this.socialAuthService.authenticateWithGoogle(googleAuthDto);
        return this.userSessionService.createUserSession(user, request);
    }
    async appleMobileLogin(appleAuthDto, request) {
        const user = await this.socialAuthService.authenticateWithApple(appleAuthDto);
        return this.userSessionService.createUserSession(user, request);
    }
    async facebookMobileLogin(facebookAuthDto, request) {
        const user = await this.socialAuthService.authenticateWithFacebook(facebookAuthDto);
        return this.userSessionService.createUserSession(user, request);
    }
    async logout(userId, refreshToken) {
        return this.userSessionService.logout(userId, refreshToken);
    }
    async refreshToken(refreshToken) {
        return this.tokenManager.refreshAccessToken(refreshToken);
    }
    async initiatePasswordReset(email) {
        return this.passwordService.initiatePasswordResetWithCode(email);
    }
    async verifyPasswordResetCode(email, code) {
        return this.passwordService.verifyPasswordResetCode(email, code);
    }
    async resetPassword(email, code, newPassword) {
        return this.passwordService.resetPasswordWithCode(email, code, newPassword);
    }
    async changePassword(userId, dto) {
        return this.passwordService.changePassword(userId, dto.oldPassword, dto.newPassword, dto.newPasswordConfirm);
    }
    async verifyEmail(verifyEmailDto) {
        return this.emailService.verifyEmail(verifyEmailDto);
    }
    async updateFcmToken(userId, fcmToken) {
        return this.userSessionService.updateFcmToken(userId, fcmToken);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_registration_service_1.UserRegistrationService,
        auth_validation_service_1.AuthValidationService,
        local_authentication_service_1.LocalAuthenticationService,
        social_authentication_service_1.SocialAuthenticationService,
        user_session_service_1.UserSessionService,
        password_service_1.PasswordService,
        token_manager_service_1.TokenManagerService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map