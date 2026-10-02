import {
  PayoutRequestQueryModel,
  AdminPayoutRequestResponse,
  PaginatedPayoutRequestsResponse,
  PayoutRequestPaginationOptions,
} from "../../../../queries/admin/PayoutRequestQueryModel";

export {
  PayoutRequestQueryModel,
  AdminPayoutRequestResponse,
  PaginatedPayoutRequestsResponse,
  PayoutRequestPaginationOptions,
};

export interface IGetAdminPayoutRequestsUseCase {
  execute(
    options?: PayoutRequestPaginationOptions
  ): Promise<PaginatedPayoutRequestsResponse>;
}

