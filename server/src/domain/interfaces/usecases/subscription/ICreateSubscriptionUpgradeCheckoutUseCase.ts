import { CreateSubscriptionUpgradeCheckoutRequest } from "../../../../application/dtos/admin/subscription/request/createSubscriptionUpgradeCheckoutRequest.dto";
import { CreateSubscriptionCheckoutResponse } from "../../../../application/dtos/admin/subscription/response/createSubscriptionCheckout.response";

export interface ICreateSubscriptionUpgradeCheckoutUseCase{
    execute(data: CreateSubscriptionUpgradeCheckoutRequest): Promise<CreateSubscriptionCheckoutResponse>
}