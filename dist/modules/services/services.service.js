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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const service_select_service_1 = require("./services/service-select.service");
let ServicesService = class ServicesService {
    constructor(serviceSelectService) {
        this.serviceSelectService = serviceSelectService;
    }
    async getAllCategories(filterDto) {
        return this.serviceSelectService.getAllCategories(filterDto);
    }
    async getCategoryById(id) {
        return this.serviceSelectService.getCategoryById(id);
    }
    async getEfficientCategoryTree() {
        return this.serviceSelectService.getEfficientCategoryTree();
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [service_select_service_1.ServiceSelectService])
], ServicesService);
//# sourceMappingURL=services.service.js.map