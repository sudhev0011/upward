import { AvailabilityResponseDto } from "../../../../application/dtos/provider/availability/availability-response.dto";

export interface IGetAvailabilityUseCase {
  /**
   * Fetch availability for a given provider
   * Throws if not found
   */
  execute(providerId: string): Promise<AvailabilityResponseDto>;
}