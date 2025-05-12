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
exports.EmailVerificationResponseDto = exports.VerifyEmailDto = exports.SendVerificationEmailDto = void 0;
const class_validator_1 = require("class-validator");
class SendVerificationEmailDto {
}
exports.SendVerificationEmailDto = SendVerificationEmailDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], SendVerificationEmailDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Verification token is required' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Verification token is required' }),
    __metadata("design:type", String)
], SendVerificationEmailDto.prototype, "verificationToken", void 0);
class VerifyEmailDto {
}
exports.VerifyEmailDto = VerifyEmailDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Verification token is required' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Verification token is required' }),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "token", void 0);
class EmailVerificationResponseDto {
}
exports.EmailVerificationResponseDto = EmailVerificationResponseDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Redirect URL is required' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Redirect URL is required' }),
    __metadata("design:type", String)
], EmailVerificationResponseDto.prototype, "redirectUrl", void 0);
//# sourceMappingURL=email.dto.js.map