import { NotFoundError } from "../../../../domain/errors/errors";
import { IPortfolioRepository } from "../../../../domain/interfaces/repositories/portfolio/IPortfolioRepository";
import { IUpdatePortfolioItemUseCase } from "../../../../domain/interfaces/usecases/portfolio/IUpdatePortfolioItemUseCase";
import { UpdatePortfolioItemRequestDto } from "../../../dtos/provider/portfolio/portfolioRequest.dto";
import { PortfolioItemResponseDto } from "../../../dtos/provider/portfolio/portfolioResponse.dto";
import { PortfolioMapper } from "../../../mapers/provider/portfolio/portfolio,mapper";

export class UpdatePortfolioItemUseCase implements IUpdatePortfolioItemUseCase {
  constructor(
    private readonly _portfolioRepository: IPortfolioRepository
  ) {}
 
  async execute(
    id: string,
    providerId: string,
    data: UpdatePortfolioItemRequestDto
  ): Promise<PortfolioItemResponseDto> {
    const existing = await this._portfolioRepository.findByIdAndProviderId(
      id,
      providerId
    );
 
    if (!existing) throw new NotFoundError("Portfolio item not found");
 
    const mergedImages = data.newImages?.length
      ? [...existing.images, ...data.newImages]
      : existing.images;
 
    const mergedStorageKeys = data.newStorageKeys?.length
      ? [...existing.storageKeys, ...data.newStorageKeys]
      : existing.storageKeys;
 
    const thumbnailUrl = mergedImages[0] ?? existing.thumbnailUrl;
 
    const updated = await this._portfolioRepository.updateByIdAndProviderId(
      id,
      providerId,
      {
        title:        data.title ?? existing.title,
        description:  data.description !== undefined ? data.description : existing.description,
        tags:         data.tags ?? existing.tags,
        images:       mergedImages,
        storageKeys:  mergedStorageKeys,
        thumbnailUrl,
      }
    );
 
    if (!updated) throw new NotFoundError("Portfolio item not found");
 
    return PortfolioMapper.toResponse(updated);
  }
}