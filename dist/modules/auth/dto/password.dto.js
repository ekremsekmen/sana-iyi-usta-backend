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
exports.ChangePasswordDto = exports.ResetPasswordWithCodeDto = exports.VerifyResetCodeDto = exports.RequestPasswordResetDto = void 0;
const class_validator_1 = require("class-validator");
class RequestPasswordResetDto {
}
exports.RequestPasswordResetDto = RequestPasswordResetDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], RequestPasswordResetDto.prototype, "email", void 0);
class VerifyResetCodeDto {
}
exports.VerifyResetCodeDto = VerifyResetCodeDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], VerifyResetCodeDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Verification code is required' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Verification code is required' }),
    (0, class_validator_1.Length)(6, 6, { message: 'Verification code must be 6 characters' }),
    __metadata("design:type", String)
], VerifyResetCodeDto.prototype, "code", void 0);
class ResetPasswordWithCodeDto {
}
exports.ResetPasswordWithCodeDto = ResetPasswordWithCodeDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], ResetPasswordWithCodeDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Verification code is required' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Verification code is required' }),
    (0, class_validator_1.Length)(6, 6, { message: 'Verification code must be 6 characters' }),
    __metadata("design:type", String)
], ResetPasswordWithCodeDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'New password is required' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'New password is required' }),
    (0, class_validator_1.Length)(8, 50, { message: 'Password must be at least 8 characters' }),
    __metadata("design:type", String)
], ResetPasswordWithCodeDto.prototype, "newPassword", void 0);
class ChangePasswordDto {
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Mevcut şifre gereklidir' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mevcut şifre gereklidir' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "oldPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Yeni şifre gereklidir' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Yeni şifre gereklidir' }),
    (0, class_validator_1.Length)(8, 50, { message: 'Yeni şifre en az 8 karakter olmalıdır' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Yeni şifre tekrarı gereklidir' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Yeni şifre tekrarı gereklidir' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPasswordConfirm", void 0);
//# sourceMappingURL=password.dto.js.map