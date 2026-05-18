import { ConflictError, NotFoundError } from "../../../domain/errors/errors";
import { ICategoryRepository } from "../../../domain/interfaces/repositories/category/ICategoryRepository";
import { IProviderServiceRepository } from "../../../domain/interfaces/repositories/provider/IProviderServiceRepository";
import { IServiceRepository } from "../../../domain/interfaces/repositories/service/IServiceRepository";
import { RangeCalculationService } from "../../../domain/services/range-calculation.service";
import { SlotGenerationService } from "../../../domain/services/slot-generation.service";
import { TimeUtil } from "../../../shared/utils/time.util";
import { GetAvailableSlotsRequestDto } from "../../dtos/provider/slot/get-available-slots-request.dto";
import { UnavailabilityResolverService } from "../../services/unavailability-resolver.service";
import { WorkingHoursResolverService } from "../../services/working-hours-resolver.service";
export const GLOBAL_SLOT_INTERVAL = 30;

export class GetAvailableSlotsUseCase {
  constructor(
    private providerServiceRepository: IProviderServiceRepository,
    private serviceRepository: IServiceRepository,
    private categoryRepository: ICategoryRepository,
    private workingHoursResolver: WorkingHoursResolverService,
    private unavailabilityResolver: UnavailabilityResolverService,
  ) {}

  async execute(input: GetAvailableSlotsRequestDto) {
    const providerService = await this.providerServiceRepository.findById(
      input.providerServiceId,
    );

    if (!providerService) {
      throw new NotFoundError("Provider service not found");
    }

    if (!providerService.isActive) {
      throw new ConflictError("Provider service is inactive");
    }

    const service = await this.serviceRepository.findById(
      providerService.serviceId,
    );

    if (!service) {
      throw new NotFoundError("Service not found");
    }

    if (!service.isActive) {
      throw new ConflictError("Service is inactive");
    }

    const category = await this.categoryRepository.findById(service.categoryId);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    if (!category.isActive) {
      throw new ConflictError("Category is inactive");
    }

    if (category.mode !== "onsite") {
      throw new ConflictError("Scheduling only supported for onsite services");
    }

    if (!service.maxHour || service.maxHour <= 0) {
      throw new ConflictError("Invalid service duration");
    }

    const workingHours = await this.workingHoursResolver.resolve(
      input.providerId,
      input.date,
    );

    if (!workingHours || !workingHours.startTime || !workingHours.endTime) {
      return [];
    }

    const workingRange = {
      start: TimeUtil.timeStringToMinutes(workingHours.startTime),

      end: TimeUtil.timeStringToMinutes(workingHours.endTime),
    };

    const blockedRanges = await this.unavailabilityResolver.resolve(
      input.providerId,
      input.date,
    );

    const freeRanges = RangeCalculationService.subtractRanges(
      workingRange,
      blockedRanges,
    );
 
    const durationMinutes = service.maxHour * 60;

    const slots = SlotGenerationService.generate(
      freeRanges,
      durationMinutes,
      GLOBAL_SLOT_INTERVAL,
    );

    return slots;
  }
}
