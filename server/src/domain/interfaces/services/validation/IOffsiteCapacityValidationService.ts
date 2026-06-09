import { ProviderService } from "../../../entities/provider-service.entity";

export interface ValidateOffsiteCapacityInput {
  providerServiceId: string;

  bookingDate: string;
}

export interface IOffsiteCapacityValidationService {
  validate(
    input: ValidateOffsiteCapacityInput,
  ): Promise<ProviderService>;
}