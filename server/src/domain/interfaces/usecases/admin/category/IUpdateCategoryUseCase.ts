import { UpdateCategoryRequestDto } from "../../../../../application/dtos/admin/category/request/update-category-request.dto";
import { CreateCategoryReponseDto } from "../../../../../application/dtos/admin/category/response/create-category-response.dto";

export interface IUpdateCategoryUseCase{
    execute(dto:UpdateCategoryRequestDto):Promise<CreateCategoryReponseDto>
}