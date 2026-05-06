import { CreateUnavailabilityRequestDto } from "../../../../application/dtos/provider/unavailability/unavailability-request.dto";
import { UnavailabilityResponseDto } from "../../../../application/dtos/provider/unavailability/unavailability-response.dto";

export interface ICreateUnavailabilityUseCase {
  
  execute(
    data: CreateUnavailabilityRequestDto
  ): Promise<UnavailabilityResponseDto>;
}