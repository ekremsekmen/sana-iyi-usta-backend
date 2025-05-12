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
exports.MechanicSearchResponseDto = exports.SearchMechanicsDto = exports.SortBy = exports.SortOrder = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "asc";
    SortOrder["DESC"] = "desc";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
var SortBy;
(function (SortBy) {
    SortBy["RATING"] = "rating";
    SortBy["DISTANCE"] = "distance";
})(SortBy || (exports.SortBy = SortBy = {}));
class SearchMechanicsDto {
    constructor() {
        this.page = 0;
        this.limit = 20;
        this.ratingSort = SortOrder.DESC;
        this.sortBy = SortBy.RATING;
    }
}
exports.SearchMechanicsDto = SearchMechanicsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchMechanicsDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SearchMechanicsDto.prototype, "brandId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SearchMechanicsDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchMechanicsDto.prototype, "onSiteService", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchMechanicsDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchMechanicsDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortOrder),
    __metadata("design:type", String)
], SearchMechanicsDto.prototype, "ratingSort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortBy),
    __metadata("design:type", String)
], SearchMechanicsDto.prototype, "sortBy", void 0);
class MechanicSearchResponseDto {
}
exports.MechanicSearchResponseDto = MechanicSearchResponseDto;
//# sourceMappingURL=search-mechanics.dto.js.map