import { CreateBookingRequestDto } from "../../../../application/dtos/client/booking/request/create-booking-request.dto";

import { CreateBookingResponseDto } from "../../../../application/dtos/client/booking/response/create-booking-response.dto";

export interface ICreateBookingUseCase {
  execute(
    clientId: string,
    data: CreateBookingRequestDto
  ): Promise<CreateBookingResponseDto>;
}