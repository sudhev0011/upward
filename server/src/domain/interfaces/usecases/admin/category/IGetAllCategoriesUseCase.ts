import { CreateCategoryReponseDto } from "../../../../../application/dtos/admin/category/response/create-category-response.dto";
import { Category } from "../../../../entities/category.entity";

export interface IGetAllCategoriesUseCase {
  execute(isAdmin: boolean): Promise<CreateCategoryReponseDto[]>;
}
