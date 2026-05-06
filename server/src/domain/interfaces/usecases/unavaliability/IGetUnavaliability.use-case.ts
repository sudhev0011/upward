import { UnavailabilityResponseDto } from "../../../../application/dtos/provider/unavailability/unavailability-response.dto";

export interface IGetUnavailabilitiesUseCase {
  
  execute(providerId: string): Promise<UnavailabilityResponseDto[]>;
}