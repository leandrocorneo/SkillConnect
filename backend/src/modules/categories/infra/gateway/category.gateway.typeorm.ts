import { Injectable } from "@nestjs/common";
import { CategoryGatewayInterface } from "./category.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/core/entities/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoryGatewayTypeorm implements CategoryGatewayInterface {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) {}

    async create(category: Partial<Category>): Promise<Category> {
        return this.categoryRepository.save(category);
    }

    async findBy(where: Partial<Category>): Promise<Category | null> {
        return this.categoryRepository.findOne({ where });
    }
}