import { Category } from "../../../../domain/entities/category.entity";
import { NotFoundError } from "../../../../domain/errors/errors";
import { ICategoryRepository } from "../../../../domain/interfaces/repositories/category/ICategoryRepository";
import { IGetAllCategoriesUseCase } from "../../../../domain/interfaces/usecases/admin/category/IGetAllCategoriesUseCase";
import { CreateCategoryReponseDto } from "../../../dtos/admin/category/response/create-category-response.dto";
import { CategoryMapper } from "../../../mapers/category/category.mapper";

export class GetAllCategoriesUseCase implements IGetAllCategoriesUseCase {
  constructor(private readonly _categoryRepository: ICategoryRepository) {}
  async execute(isAdmin: boolean): Promise<CreateCategoryReponseDto[]> {
    let categories;
    if (isAdmin) {
      categories = await this._categoryRepository.findAll();
    } else {
      categories = await this._categoryRepository.findAllActive();
    }

    if (!categories) {
      throw new NotFoundError("category not found");
    }

    const result = categories.map((cat: Category) => {
      return CategoryMapper.toResponse(cat);
    });

    return result;
  }
}
