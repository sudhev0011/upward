import { Category } from "../../../../domain/entities/category.entity";
import { ConflictError } from "../../../../domain/errors/errors";
import { ICategoryRepository } from "../../../../domain/interfaces/repositories/category/ICategoryRepository";
import { ICreateCategoryUseCase } from "../../../../domain/interfaces/usecases/admin/category/ICreateCategoryUseCase";
import { CreateCategoryRequestDto } from "../../../dtos/admin/category/request/create-category-request.dto";
import { CreateCategoryReponseDto } from "../../../dtos/admin/category/response/create-category-response.dto";
import { CategoryMapper } from "../../../mapers/category/category.mapper";

export class CreateCategoryUseCase implements ICreateCategoryUseCase {
  constructor(private readonly _categoryRepository: ICategoryRepository) {}

  async execute(
    data: CreateCategoryRequestDto,
  ): Promise<CreateCategoryReponseDto> {
    const normalizedName = data.name.trim().toLowerCase();

    const existing = await this._categoryRepository.findOne({
      name: normalizedName,
    });

    if (existing) {
      throw new ConflictError("A category with the same name already exists");
    }

    const category = Category.create({
      name: normalizedName,
      description: data.description ?? null,
      mode: data.mode,
      isActive: data.isActive,
    });

    const created = await this._categoryRepository.create(category);

    return CategoryMapper.toResponse(created);
  }
}
