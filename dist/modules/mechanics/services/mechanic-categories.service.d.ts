import { PrismaService } from '../../../prisma/prisma.service';
import { MechanicCategoryDto } from '../dto/mechanic-category.dto';
export declare class MechanicCategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByMechanic(mechanicId: string): Promise<({
        categories: {
            id: string;
            name: string;
            created_at: Date | null;
            parent_id: string | null;
        };
    } & {
        id: string;
        created_at: Date | null;
        mechanic_id: string;
        category_id: string;
    })[]>;
    create(dto: MechanicCategoryDto | MechanicCategoryDto[]): Promise<any[] | ({
        categories: {
            id: string;
            name: string;
            created_at: Date | null;
            parent_id: string | null;
        };
    } & {
        id: string;
        created_at: Date | null;
        mechanic_id: string;
        category_id: string;
    })>;
    remove(id: string): Promise<{
        categories: {
            id: string;
            name: string;
            created_at: Date | null;
            parent_id: string | null;
        };
    } & {
        id: string;
        created_at: Date | null;
        mechanic_id: string;
        category_id: string;
    }>;
    removeByMechanicAndCategory(mechanicId: string, categoryId: string): Promise<{
        categories: {
            id: string;
            name: string;
            created_at: Date | null;
            parent_id: string | null;
        };
    } & {
        id: string;
        created_at: Date | null;
        mechanic_id: string;
        category_id: string;
    }>;
    updateBulkCategories(mechanicId: string, categoryIds: string[]): Promise<({
        categories: {
            id: string;
            name: string;
            created_at: Date | null;
            parent_id: string | null;
        };
    } & {
        id: string;
        created_at: Date | null;
        mechanic_id: string;
        category_id: string;
    })[]>;
    private createMultipleCategories;
    createForMechanic(mechanicId: string, dto: MechanicCategoryDto | MechanicCategoryDto[]): Promise<any[] | ({
        categories: {
            id: string;
            name: string;
            created_at: Date | null;
            parent_id: string | null;
        };
    } & {
        id: string;
        created_at: Date | null;
        mechanic_id: string;
        category_id: string;
    })>;
}
