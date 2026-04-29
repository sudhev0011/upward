import { GetPaginatedServicesDto } from "../../../../application/dtos/admin/service/request/get-paginated-services-response.dto";
import { GetServicesResponseDto } from "../../../../application/dtos/admin/service/response/paginated-service.response.dto";

export interface IGetAllServicesWithPagination {
    execute(dto: GetPaginatedServicesDto):Promise<GetServicesResponseDto>
}