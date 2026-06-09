import { CreateOffsiteBookingRequestDto } from "../../../../application/dtos/client/booking/request/Create-offsite-booking-request.dto";
import { CreateBookingResponseDto } from "../../../../application/dtos/client/booking/response/create-booking-response.dto";

export interface ICreateOffsiteBookingUseCase {
  execute(
    clientId: string,
    data: CreateOffsiteBookingRequestDto,
  ): Promise<CreateBookingResponseDto>;
}