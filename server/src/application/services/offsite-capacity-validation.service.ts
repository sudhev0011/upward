import { NotFoundError, ValidationError } from "../../domain/errors/errors";
import { IBookingRepository } from "../../domain/interfaces/repositories/booking/IBookingRepository";
import { IProviderServiceRepository } from "../../domain/interfaces/repositories/provider/IProviderServiceRepository";
import {
  IOffsiteCapacityValidationService,
  ValidateOffsiteCapacityInput,
} from "../../domain/interfaces/services/validation/IOffsiteCapacityValidationService";

export class OffsiteCapacityValidationService implements IOffsiteCapacityValidationService {
  constructor(
    private providerServiceRepository: IProviderServiceRepository,

    private bookingRepository: IBookingRepository,
  ) {}

  async validate(input: ValidateOffsiteCapacityInput) {
    const providerService = await this.providerServiceRepository.findById(
      input.providerServiceId,
    );

    if (!providerService) {
      throw new NotFoundError("Provider service not found");
    }

    if (!providerService.dailyCapacity) {
      throw new ValidationError("Daily capacity not configured");
    }

    if (providerService.dailyCapacity <= 0) {
      throw new ValidationError("Invalid daily capacity configuration");
    }

    const activeBookings =
      await this.bookingRepository.countActiveOffsiteBookingsForDate(
        input.providerServiceId,

        input.bookingDate,
      );

    if (activeBookings >= providerService.dailyCapacity) {
      throw new ValidationError(
        "Provider has reached maximum project capacity for this day",
      );
    }

    return providerService;
  }
}
