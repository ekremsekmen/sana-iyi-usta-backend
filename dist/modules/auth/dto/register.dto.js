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
exports.RegisterDto = exports.AuthProvider = exports.UserRole = void 0;
const class_validator_1 = require("class-validator");
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "customer";
    UserRole["MECHANIC"] = "mechanic";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var AuthProvider;
(function (AuthProvider) {
    AuthProvider["LOCAL"] = "local";
    AuthProvider["GOOGLE"] = "google";
    AuthProvider["FACEBOOK"] = "facebook";
    AuthProvider["ICLOUD"] = "icloud";
})(AuthProvider || (exports.AuthProvider = AuthProvider = {}));
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Full name is required' }),
    (0, class_validator_1.Length)(2, 50, { message: 'Full name must be between 2 and 50 characters' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "full_name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "e_mail", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Password is required' }),
    (0, class_validator_1.Length)(8, 64, { message: 'Password must be between 8 and 64 characters' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(UserRole, { message: 'Role is invalid' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'KVKK approval is required' }),
    __metadata("design:type", Boolean)
], RegisterDto.prototype, "kvkk_approved", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'Terms approval is required' }),
    __metadata("design:type", Boolean)
], RegisterDto.prototype, "terms_approved", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(AuthProvider, { message: 'Auth provider is invalid' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "auth_provider", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Provider ID is required for social login' }),
    (0, class_validator_1.ValidateIf)((o) => o.auth_provider !== AuthProvider.LOCAL),
    __metadata("design:type", String)
], RegisterDto.prototype, "provider_id", void 0);
//# sourceMappingURL=register.dto.js.map