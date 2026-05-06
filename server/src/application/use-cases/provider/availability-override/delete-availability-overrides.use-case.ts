import { NotFoundError } from "../../../../domain/errors/errors";
import { IAvailabilityOverrideRepository } from "../../../../domain/interfaces/repositories/availability-override/IAvailability-override.repository";

export class DeleteAvailabilityOverrideUseCase {
  constructor(
    private readonly _availabilityOverrideRepository: IAvailabilityOverrideRepository
  ) {}

  async execute(providerId: string, date: string): Promise<void> {
    const deleted =
      await this._availabilityOverrideRepository.deleteByProviderAndDate(
        providerId,
        date
      );

    if (!deleted) {
      throw new NotFoundError(
        `No override found for provider on ${date}`
      );
    }
  }
}