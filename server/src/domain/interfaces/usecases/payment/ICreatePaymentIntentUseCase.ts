import { CreatePaymentIntentRequestDto } from "../../../../application/dtos/client/payment/create-payment-intent-request.dto";

import { CreatePaymentIntentResponseDto } from "../../../../application/dtos/client/payment/create-payment-intent-response.dto";

export interface ICreatePaymentIntentUseCase {

  execute(
    clientId: string,
    data: CreatePaymentIntentRequestDto
  ): Promise<CreatePaymentIntentResponseDto>;
}