import { Category } from "src/core/entities/category.entity";

export interface CategoryGatewayInterface {
    create(category: Partial<Category>): Promise<Category>;
    findBy(where: Partial<Category>): Promise<Category | null>;
}