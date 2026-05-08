import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/core/entities/category.entity";
import { CategoryController } from "./presentation/controllers/category.controller";
import { CreateCategoryUseCase } from "./domain/use-cases/create-category.use-case";
import { CategoryGatewayTypeorm } from "./infra/gateway/category.gateway.typeorm";
import { FindCategoryByUseCase } from "./domain/use-cases/find-category-by.use-case";

@Module({
      imports: [TypeOrmModule.forFeature([Category])],
      controllers: [CategoryController],
      providers: [
            CreateCategoryUseCase,
            FindCategoryByUseCase,
            CategoryGatewayTypeorm,
            {
                  provide: "CategoryGatewayInterface",
                  useClass: CategoryGatewayTypeorm,
            },
      ],
      exports: ["CategoryGatewayInterface"],
})

export class CategoriesModule {}
