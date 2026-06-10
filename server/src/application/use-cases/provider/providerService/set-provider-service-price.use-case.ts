import {
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../../../../domain/errors/errors";
import { ICategoryRepository } from "../../../../domain/interfaces/repositories/category/ICategoryRepository";
import { IProviderProfileRepository } from "../../../../domain/interfaces/repositories/provider/IProviderProfileRepository";
import { IProviderServiceRepository } from "../../../../domain/interfaces/repositories/provider/IProviderServiceRepository";
import { IServiceRepository } from "../../../../domain/interfaces/repositories/service/IServiceRepository";
import { ILogger } from "../../../../domain/interfaces/services/ILogger";
import { IConfigureProviderServiceUseCase } from "../../../../domain/interfaces/usecases/provider/providerService/ISetProviderServicePriceUseCase";
import { setProviderServicePriceRequestDto } from "../../../dtos/provider/providerService/request/set-provider-service-price-request.dto";
import { ProviderServiceResponseDto } from "../../../dtos/provider/providerService/response/provider-service-response.dto";
import { ProviderServiceMapper } from "../../../mapers/provider/provider-service-mapper";

export class ConfigureProviderServiceUseCase implements IConfigureProviderServiceUseCase {
  constructor(
    private readonly _providerServiceRepository: IProviderServiceRepository,
    private readonly _serviceRepository: IServiceRepository,
    private readonly _providerProfileRepository: IProviderProfileRepository,
    private readonly _categoryRepository: ICategoryRepository,
    private readonly _logger: ILogger,
  ) {}

  async execute(
    data: setProviderServicePriceRequestDto,
  ): Promise<ProviderServiceResponseDto> {
    const providerService = await this._providerServiceRepository.findById(
      data.providerServiceId,
    );

    if (!providerService) {
      throw new NotFoundError(
        "Service not found: the selected service is not found, please select the service first.",
      );
    }

    const service = await this._serviceRepository.findById(
      providerService.serviceId,
    );

    if (!service) {
      throw new NotFoundError("Master service not found");
    }

    if (service.mode === "offsite") {
      if (!data.dailyCapacity || data.dailyCapacity <= 0) {
        throw new ValidationError(
          "Daily capacity is required for offsite services",
        );
      }
    }

    const updatedProviderService = providerService.configure({
      price: data.price,

      dailyCapacity: service.mode === "offsite" ? data.dailyCapacity! : null,
    });

    const saved = await this._providerServiceRepository.update(
      updatedProviderService.id!,
      updatedProviderService,
    );

    if (!saved) {
      throw new InternalServerError("Database error");
    }

    if (!service) {
      this._logger.error(
        `SetProviderServicePriceUseCase: master service not found for serviceId=${providerService.serviceId}. Category not synced to provider profile.`,
      );
      return ProviderServiceMapper.toResponse(saved);
    }

    const category = await this._categoryRepository.findById(
      service.categoryId,
    );

    if (!category) {
      this._logger.error(
        `SetProviderServicePriceUseCase: category not found for categoryId=${service.categoryId}. Category not synced to provider profile.`,
      );
      return ProviderServiceMapper.toResponse(saved);
    }

    await this._providerProfileRepository
      .addCategoryIfAbsent(providerService.providerId, category.name)
      .catch((err) => {
        this._logger.error(
          `SetProviderServicePriceUseCase: failed to sync category to provider profile. providerId=${providerService.providerId}`,
          err,
        );
      });

    return ProviderServiceMapper.toResponse(saved);
  }
}
