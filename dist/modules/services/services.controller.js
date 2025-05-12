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
exports.ServicesController = void 0;
const common_1 = require("@nestjs/common");
const services_service_1 = require("./services.service");
const service_select_dto_1 = require("./dto/service-select.dto");
const guards_1 = require("../../common/guards");
let ServicesController = class ServicesController {
    constructor(servicesService) {
        this.servicesService = servicesService;
    }
    async getCategories(filterDto) {
        return this.servicesService.getAllCategories(filterDto);
    }
    async getParentCategories() {
        const filterDto = { parentId: 'null' };
        return this.servicesService.getAllCategories(filterDto);
    }
    async getCategoryTree() {
        return this.servicesService.getEfficientCategoryTree();
    }
    async getCategoryById(id) {
        try {
            return await this.servicesService.getCategoryById(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException(`Kategori bulunamadı: ${id}`);
        }
    }
    async getSubcategoriesByParentId(parentId) {
        try {
            const filterDto = { parentId };
            return await this.servicesService.getAllCategories(filterDto);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException(`Alt kategoriler bulunamadı. Üst kategori ID: ${parentId}`);
        }
    }
};
exports.ServicesController = ServicesController;
__decorate([
    (0, common_1.Get)('categories'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [service_select_dto_1.CategoryFilterDto]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('parent-categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getParentCategories", null);
__decorate([
    (0, common_1.Get)('category-tree'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getCategoryTree", null);
__decorate([
    (0, common_1.Get)('category/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.Get)('subcategories/:parentId'),
    __param(0, (0, common_1.Param)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getSubcategoriesByParentId", null);
exports.ServicesController = ServicesController = __decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Controller)('services'),
    __metadata("design:paramtypes", [services_service_1.ServicesService])
], ServicesController);
//# sourceMappingURL=services.controller.js.map