import { SetAvailabilityOverrideRequestDto } from "../../../../application/dtos/provider/availability-override/availability-override-request.dto";
import { AvailabilityOverrideResponseDto } from "../../../../application/dtos/provider/availability-override/availability-override-response.dto";

export interface ISetAvailabilityOverrideUseCase {
  
  execute(
    data: SetAvailabilityOverrideRequestDto & {providerId: string}
  ): Promise<AvailabilityOverrideResponseDto>;
}