import { GetAllPlansRequestDto } from "../../../../application/dtos/admin/subscription/request/getAllPlansRequest.dto";
import { ListSubscriptionsDto } from "../../../../application/dtos/admin/subscription/response/listSubscriptions.dto";

export interface IGetAllSubscriptionPlansUseCase {
  execute(
    params: GetAllPlansRequestDto,
  ): Promise<ListSubscriptionsDto>;
}