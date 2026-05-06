import { NotFoundError } from "../../../../domain/errors/errors";
import { IUnavailabilityRepository } from "../../../../domain/interfaces/repositories/unavailability/IUnavaliability-repository";

export class DeleteUnavailabilityUseCase {
  constructor(
    private readonly _unavailabilityRepository: IUnavailabilityRepository
  ) {}

  async execute(id: string): Promise<void> {
    const deleted = await this._unavailabilityRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError("Unavailability block not found");
    }
  }
}