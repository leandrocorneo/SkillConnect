import { Inject, Injectable } from "@nestjs/common";
import { Category } from "src/core/entities/category.entity";
import { CategoryGatewayInterface } from "../../infra/gateway/category.interface";

@Injectable()
export class FindCategoryByUseCase {
    constructor(
        @Inject("CategoryGatewayInterface")
        private readonly categoryGateway: CategoryGatewayInterface
    ) {}

    async execute(categoryData: Partial<Category>): Promise<Category> {
        return this.categoryGateway.findBy(categoryData);
    }
}
