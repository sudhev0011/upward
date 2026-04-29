import { NotFoundError } from "../../../../domain/errors/errors";
import { ICategoryRepository } from "../../../../domain/interfaces/repositories/category/ICategoryRepository";
import { IGetAllCategoriesWithPagination } from "../../../../domain/interfaces/usecases/admin/category/IGetAllCategoriesWithPaginationUseCase";
import { GetPaginatedCategoriesDto } from "../../../dtos/admin/category/request/get-paginated-category-request.dto";
import { GetCategoriesResponseDto } from "../../../dtos/admin/category/response/paginated-category-response.dto";
import { CategoryMapper } from "../../../mapers/category/category.mapper";

export class GetAllCategoriesWithPaginationUseCase implements IGetAllCategoriesWithPagination {
  constructor(private readonly _categoryRepository: ICategoryRepository) {}
  async execute(
    query: GetPaginatedCategoriesDto,
  ): Promise<GetCategoriesResponseDto> {
    const result = await this._categoryRepository.getPaginatedCategories(query);

    if (!result) {
      throw new NotFoundError("categories not found");
    }

    return {
      data: result.data.map(CategoryMapper.toResponse),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
