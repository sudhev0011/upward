import { Category } from "../../../domain/entities/category.entity";
import { EntityNotPersistedError } from "../../../domain/errors/errors";
import { CreateCategoryReponseDto } from "../../dtos/admin/category/response/create-category-response.dto";

export class CategoryMapper {
  static toResponse(category: Category): CreateCategoryReponseDto {
    if (!category.id) {
      throw new EntityNotPersistedError("Category");
    }

    return {
      id: category.id,
      name: category.name,
      description: category.description ?? "",
      mode: category.mode,
      isActive: category.isActive,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }
}
