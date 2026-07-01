import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository";
import { ListSubscriptionsDto } from "../../../dtos/admin/subscription/response/listSubscriptions.dto";
import { GetAllPlansRequestDto } from "../../../dtos/admin/subscription/request/getAllPlansRequest.dto";

export class GetAllSubscriptionPlansUseCase {
  constructor(
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(params: GetAllPlansRequestDto): Promise<ListSubscriptionsDto> {
    const { page, limit, search, sort, sortOrder } = params;

    const filter: Record<string, unknown> = {};

    if (search && search.trim() !== "") {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    return this.subscriptionPlanRepository.paginate(filter, {
      page,
      limit,
      sortBy: sort,
      sortOrder,
    });
  }
}
