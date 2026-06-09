import { CreateCategoryReponseDto } from "../../../../../application/dtos/admin/category/response/create-category-response.dto";

export interface IGetAllCategoriesUseCase {
  execute(isAdmin: boolean): Promise<CreateCategoryReponseDto[]>;
}
