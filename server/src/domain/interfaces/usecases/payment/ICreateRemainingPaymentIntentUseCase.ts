import { CreateRemainingPaymentIntentRequestDto } from "../../../../application/dtos/client/payment/create-remaining-payment-intent-request.dto";
import { CreateRemainingPaymentIntentResponseDto } from "../../../../application/dtos/client/payment/create-remaining-payment-intent-response.dto";

export interface ICreateRemainingPaymentIntentUseCase {
  execute(
    clientId: string,
    data: CreateRemainingPaymentIntentRequestDto,
  ): Promise<CreateRemainingPaymentIntentResponseDto>;
}