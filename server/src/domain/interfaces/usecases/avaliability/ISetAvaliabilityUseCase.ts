import { SetAvailabilityRequestDto } from "../../../../application/dtos/provider/availability/availability-request.dto";
import { AvailabilityResponseDto } from "../../../../application/dtos/provider/availability/availability-response.dto";

export interface ISetAvailabilityUseCase {
  /**
   * Creates or replaces a provider's weekly availability schedule
   */
  execute(
    data: SetAvailabilityRequestDto
  ): Promise<AvailabilityResponseDto>;
}