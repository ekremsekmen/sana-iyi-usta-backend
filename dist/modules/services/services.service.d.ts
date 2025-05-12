import { ServiceSelectService } from './services/service-select.service';
import { CategoryDto, CategoryFilterDto } from './dto/service-select.dto';
export declare class ServicesService {
    private readonly serviceSelectService;
    constructor(serviceSelectService: ServiceSelectService);
    getAllCategories(filterDto?: CategoryFilterDto): Promise<CategoryDto[]>;
    getCategoryById(id: string): Promise<CategoryDto>;
    getEfficientCategoryTree(): Promise<CategoryDto[]>;
}
