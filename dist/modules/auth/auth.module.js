"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const prisma_module_1 = require("../../prisma/prisma.module");
const local_strategy_1 = require("./strategies/local.strategy");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const token_manager_service_1 = require("./services/token-manager.service");
const email_service_1 = require("./services/email.service");
const session_manager_service_1 = require("./services/session-manager.service");
const user_registration_service_1 = require("./services/user-registration.service");
const auth_validation_service_1 = require("./services/auth-validation.service");
const local_authentication_service_1 = require("./services/local-authentication.service");
const social_authentication_service_1 = require("./services/social-authentication.service");
const user_session_service_1 = require("./services/user-session.service");
const password_service_1 = require("./services/password.service");
const config_1 = require("@nestjs/config");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            prisma_module_1.PrismaModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt', session: false }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '15m' },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            local_strategy_1.LocalStrategy,
            jwt_strategy_1.JwtStrategy,
            token_manager_service_1.TokenManagerService,
            email_service_1.EmailService,
            session_manager_service_1.SessionManagerService,
            user_registration_service_1.UserRegistrationService,
            auth_validation_service_1.AuthValidationService,
            local_authentication_service_1.LocalAuthenticationService,
            social_authentication_service_1.SocialAuthenticationService,
            user_session_service_1.UserSessionService,
            password_service_1.PasswordService,
        ],
        exports: [auth_service_1.AuthService, token_manager_service_1.TokenManagerService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map