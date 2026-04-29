import { CreateCategoryRequestDto } from "../../../../../application/dtos/admin/category/request/create-category-request.dto";
import { CreateCategoryReponseDto } from "../../../../../application/dtos/admin/category/response/create-category-response.dto";

export interface ICreateCategoryUseCase {
  execute(data: CreateCategoryRequestDto): Promise<CreateCategoryReponseDto>;
}
