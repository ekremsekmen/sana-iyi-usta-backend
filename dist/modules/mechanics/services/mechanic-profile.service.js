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
exports.MechanicProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const crypto_1 = require("crypto");
let MechanicProfileService = class MechanicProfileService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const existingMechanic = await this.prisma.mechanics.findFirst({
            where: { user_id: userId }
        });
        if (existingMechanic) {
            throw new common_1.ConflictException('Bu kullanıcı için zaten bir tamirci profili bulunmaktadır. Bir kullanıcı yalnızca bir tamirci profiline sahip olabilir.');
        }
        return this.prisma.mechanics.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                business_name: dto.business_name,
                on_site_service: dto.on_site_service,
                users: { connect: { id: userId } },
            },
        });
    }
    async findOne(id) {
        const mechanic = await this.prisma.mechanics.findUnique({ where: { id } });
        if (!mechanic) {
            throw new common_1.NotFoundException(`Mechanic with id ${id} not found.`);
        }
        return mechanic;
    }
    async update(id, userId, dto) {
        try {
            const updateData = {
                business_name: dto.business_name,
                on_site_service: dto.on_site_service,
            };
            const currentMechanic = await this.prisma.mechanics.findUnique({
                where: { id },
                select: { user_id: true }
            });
            if (currentMechanic && currentMechanic.user_id !== userId) {
                updateData.users = {
                    disconnect: { id: currentMechanic.user_id },
                    connect: { id: userId }
                };
            }
            return await this.prisma.mechanics.update({
                where: { id },
                data: updateData,
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Mechanic with id ${id} not found.`);
        }
    }
    async remove(id) {
        return this.prisma.mechanics.delete({ where: { id } });
    }
    async findByUserId(userId) {
        const mechanic = await this.prisma.mechanics.findFirst({
            where: { user_id: userId }
        });
        return {
            hasMechanicProfile: !!mechanic,
            profile: mechanic || null
        };
    }
};
exports.MechanicProfileService = MechanicProfileService;
exports.MechanicProfileService = MechanicProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MechanicProfileService);
//# sourceMappingURL=mechanic-profile.service.js.map