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
exports.FacebookAuthDto = exports.AppleAuthDto = exports.GoogleAuthDto = void 0;
const class_validator_1 = require("class-validator");
const register_dto_1 = require("./register.dto");
class GoogleAuthDto {
}
exports.GoogleAuthDto = GoogleAuthDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Access token is required' }),
    (0, class_validator_1.IsString)({ message: 'Access token must be a string' }),
    __metadata("design:type", String)
], GoogleAuthDto.prototype, "accessToken", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Provider ID is required' }),
    (0, class_validator_1.IsString)({ message: 'Provider ID must be a string' }),
    __metadata("design:type", String)
], GoogleAuthDto.prototype, "providerId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    __metadata("design:type", String)
], GoogleAuthDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Full name must be a string' }),
    __metadata("design:type", String)
], GoogleAuthDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Picture link must be a string' }),
    __metadata("design:type", String)
], GoogleAuthDto.prototype, "picture", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(register_dto_1.UserRole, { message: 'Role is invalid' }),
    __metadata("design:type", String)
], GoogleAuthDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'KVKK approval must be boolean' }),
    __metadata("design:type", Boolean)
], GoogleAuthDto.prototype, "kvkkApproved", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Terms approval must be boolean' }),
    __metadata("design:type", Boolean)
], GoogleAuthDto.prototype, "termsApproved", void 0);
class AppleAuthDto {
}
exports.AppleAuthDto = AppleAuthDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Identity token is required' }),
    (0, class_validator_1.IsString)({ message: 'Identity token must be a string' }),
    __metadata("design:type", String)
], AppleAuthDto.prototype, "identityToken", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Provider ID is required' }),
    (0, class_validator_1.IsString)({ message: 'Provider ID must be a string' }),
    __metadata("design:type", String)
], AppleAuthDto.prototype, "providerId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    __metadata("design:type", String)
], AppleAuthDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Full name must be a string' }),
    __metadata("design:type", String)
], AppleAuthDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(register_dto_1.UserRole, { message: 'Role is invalid' }),
    __metadata("design:type", String)
], AppleAuthDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'KVKK approval must be boolean' }),
    __metadata("design:type", Boolean)
], AppleAuthDto.prototype, "kvkkApproved", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Terms approval must be boolean' }),
    __metadata("design:type", Boolean)
], AppleAuthDto.prototype, "termsApproved", void 0);
class FacebookAuthDto {
}
exports.FacebookAuthDto = FacebookAuthDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Access token is required' }),
    (0, class_validator_1.IsString)({ message: 'Access token must be a string' }),
    __metadata("design:type", String)
], FacebookAuthDto.prototype, "accessToken", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Provider ID is required' }),
    (0, class_validator_1.IsString)({ message: 'Provider ID must be a string' }),
    __metadata("design:type", String)
], FacebookAuthDto.prototype, "providerId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    __metadata("design:type", String)
], FacebookAuthDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Full name must be a string' }),
    __metadata("design:type", String)
], FacebookAuthDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Picture must be a string' }),
    __metadata("design:type", String)
], FacebookAuthDto.prototype, "picture", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(register_dto_1.UserRole, { message: 'Role is invalid' }),
    __metadata("design:type", String)
], FacebookAuthDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'KVKK approval must be boolean' }),
    __metadata("design:type", Boolean)
], FacebookAuthDto.prototype, "kvkkApproved", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Terms approval must be boolean' }),
    __metadata("design:type", Boolean)
], FacebookAuthDto.prototype, "termsApproved", void 0);
//# sourceMappingURL=social-auth.dto.js.map