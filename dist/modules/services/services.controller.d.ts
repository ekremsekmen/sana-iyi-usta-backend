import { ServicesService } from './services.service';
import { CategoryDto, CategoryFilterDto } from './dto/service-select.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    getCategories(filterDto: CategoryFilterDto): Promise<CategoryDto[]>;
    getParentCategories(): Promise<CategoryDto[]>;
    getCategoryTree(): Promise<CategoryDto[]>;
    getCategoryById(id: string): Promise<CategoryDto>;
    getSubcategoriesByParentId(parentId: string): Promise<CategoryDto[]>;
}
