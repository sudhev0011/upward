import { CreateSubscriptionCheckoutRequest } from "../../../../application/dtos/admin/subscription/request/createSubscriptionCheckoutRequest.dto";
import { CreateSubscriptionCheckoutResponse } from "../../../../application/dtos/admin/subscription/response/createSubscriptionCheckout.response";

export interface ICreateSubscriptionCheckoutUseCase {
  execute(
    data: CreateSubscriptionCheckoutRequest,
  ): Promise<CreateSubscriptionCheckoutResponse>;
}