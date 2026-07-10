import { IGetUploadUrlUseCase } from "../../../../domain/interfaces/usecases/portfolio/IGetUploadUrlUseCase";
import { IS3Service } from "../../../../domain/interfaces/services/IS3Service";
import { GetUploadUrlResponseDto } from "../../../dtos/provider/portfolio/portfolioResponse.dto";
import { IPortfolioRepository } from "../../../../domain/interfaces/repositories/portfolio/IPortfolioRepository";
import { IProviderSubscriptionRepository } from "../../../../domain/interfaces/repositories/provider-subscription/IProviderSubscriptionRepository";
import { LimitError } from "../../../../domain/errors/errors";

export class GetUploadUrlUseCase implements IGetUploadUrlUseCase {
  constructor(
    private readonly _s3Service: IS3Service,
    private readonly _portfolioRepository: IPortfolioRepository,
    private readonly _providerSubscriptionRepository: IProviderSubscriptionRepository,
  ) {}

  async execute(data: {
    providerId: string;
    fileName: string;
    contentType: string;
  }): Promise<GetUploadUrlResponseDto> {
    const limits =
      await this._providerSubscriptionRepository.getActivePlanLimitsByProvider(
        data.providerId,
      );

    const portfoliosCount =
      await this._portfolioRepository.portfoliosCountByProvider(
        data.providerId,
      );

    if (portfoliosCount >= limits.maxPortfolios) {
      throw new LimitError(
        `Limit reached. Your active plan only allows up to ${limits.maxPortfolios} portfolios.`,
      );
    }

    const ext = data.fileName.split(".").pop();
    const storageKey = `portfolios/${data.providerId}-${Date.now()}.${ext}`;

    const { uploadUrl, fileUrl } = await this._s3Service.generateUploadUrl(
      storageKey,
      data.contentType,
    );

    return { uploadUrl, fileUrl, storageKey };
  }
}
