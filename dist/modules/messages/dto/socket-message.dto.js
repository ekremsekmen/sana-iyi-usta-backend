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
exports.SocketNotificationDto = exports.SocketDeleteConversationDto = exports.SocketReadAllMessagesDto = exports.SocketReadMessageDto = exports.SocketMessageDto = void 0;
const class_validator_1 = require("class-validator");
class SocketMessageDto {
}
exports.SocketMessageDto = SocketMessageDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SocketMessageDto.prototype, "receiverId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SocketMessageDto.prototype, "content", void 0);
class SocketReadMessageDto {
}
exports.SocketReadMessageDto = SocketReadMessageDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SocketReadMessageDto.prototype, "messageId", void 0);
class SocketReadAllMessagesDto {
}
exports.SocketReadAllMessagesDto = SocketReadAllMessagesDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SocketReadAllMessagesDto.prototype, "senderId", void 0);
class SocketDeleteConversationDto {
}
exports.SocketDeleteConversationDto = SocketDeleteConversationDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SocketDeleteConversationDto.prototype, "otherUserId", void 0);
class SocketNotificationDto {
}
exports.SocketNotificationDto = SocketNotificationDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SocketNotificationDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SocketNotificationDto.prototype, "data", void 0);
//# sourceMappingURL=socket-message.dto.js.map