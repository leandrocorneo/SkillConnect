import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { CreateCategoryUseCase } from "../../domain/use-cases/create-category.use-case";
import { CreateCategoryDto } from "../dto/input/create-category.dto";
import { BaseResponseDto } from "src/shared/dto/base-response.dto";
import { CreatedCategoryDto } from "../dto/output/created-category.dto";
import { Category } from "src/core/entities/category.entity";
import { FindCategoryByUseCase } from "../../domain/use-cases/find-category-by.use-case";

@Controller('categories')
export class CategoryController {
    constructor(
        private readonly createCategoryUseCase: CreateCategoryUseCase,
        private readonly findCategoryByUseCase: FindCategoryByUseCase
    ) {}

    @Post()
    async create(@Body() categoryDto: CreateCategoryDto): Promise<BaseResponseDto<CreatedCategoryDto>>{
        const category = await this.createCategoryUseCase.execute(categoryDto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Category created successfully',
            data: category as CreatedCategoryDto
        }
    }
    
    @Get(':id')
    async findById(@Param('id') id: number): Promise<BaseResponseDto<Category>> {
        const category = await this.findCategoryByUseCase.execute({ id });
        return {
            statusCode: HttpStatus.OK,
            message: 'Category retrieved successfully',
            data: category
        }
    }
}
