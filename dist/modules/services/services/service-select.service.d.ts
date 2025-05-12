import { PrismaService } from '../../../prisma/prisma.service';
import { CategoryDto, CategoryFilterDto } from '../dto/service-select.dto';
export declare class ServiceSelectService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllCategories(filterDto?: CategoryFilterDto): Promise<CategoryDto[]>;
    getParentCategories(): Promise<CategoryDto[]>;
    getCategoryById(id: string): Promise<CategoryDto>;
    getSubcategoriesByParentId(parentId: string): Promise<CategoryDto[]>;
    getEfficientCategoryTree(): Promise<CategoryDto[]>;
}
