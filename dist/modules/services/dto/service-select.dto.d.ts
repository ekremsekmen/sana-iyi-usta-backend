export declare class CategoryDto {
    id: string;
    name: string;
    parent_id: string | null;
    subcategories?: CategoryDto[];
    created_at: Date;
}
export declare class CategoryFilterDto {
    onlyParentCategories?: boolean;
    parentId?: string;
}
