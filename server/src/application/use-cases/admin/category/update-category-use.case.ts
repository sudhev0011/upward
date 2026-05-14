import { ValidationError } from "../../../../domain/errors/errors";
import { ICategoryRepository } from "../../../../domain/interfaces/repositories/category/ICategoryRepository";
import { IUpdateCategoryUseCase } from "../../../../domain/interfaces/usecases/admin/category/IUpdateCategoryUseCase";
import { UpdateCategoryRequestDto } from "../../../dtos/admin/category/request/update-category-request.dto";
import { CreateCategoryReponseDto } from "../../../dtos/admin/category/response/create-category-response.dto";
import { CategoryMapper } from "../../../mapers/category/category.mapper";

export class UpdateCategoryUseCase implements IUpdateCategoryUseCase {
  constructor(private readonly _categoryRepository: ICategoryRepository) {}
  async execute(
    dto: UpdateCategoryRequestDto,
  ): Promise<CreateCategoryReponseDto> {
    
    const result = await this._categoryRepository.update(dto.id, {
      name: dto.name,
      description: dto.description,
      mode: dto.mode,
      isActive: dto.isActive,
    });

    if (!result) {
      throw new ValidationError("category id is invalid");
    }

    return CategoryMapper.toResponse(result);
  }
}
