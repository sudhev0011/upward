import { PortfolioItem } from "../../../../domain/entities/portfolio.entity";
import { IPortfolioRepository } from "../../../../domain/interfaces/repositories/portfolio/IPortfolioRepository";
import { ICreatePortfolioItemUseCase } from "../../../../domain/interfaces/usecases/portfolio/ICreatePortfolioItemUseCase";
import { CreatePortfolioItemRequestDto } from "../../../dtos/provider/portfolio/portfolioRequest.dto";
import { PortfolioItemResponseDto } from "../../../dtos/provider/portfolio/portfolioResponse.dto";
import { PortfolioMapper } from "../../../mapers/provider/portfolio/portfolio,mapper";

export class CreatePortfolioItemUseCase implements ICreatePortfolioItemUseCase {
  constructor(
    private readonly _portfolioRepository: IPortfolioRepository
  ) {}
 
  async execute(
    data: CreatePortfolioItemRequestDto
  ): Promise<PortfolioItemResponseDto> {
    
    const item = PortfolioItem.create({
      providerId:   data.providerId,
      title:        data.title,
      description:  data.description ?? null,
      images:       data.images,
      storageKeys:  data.storageKeys,
      thumbnailUrl: data.thumbnailUrl ?? null,
      tags:         data.tags ?? [],
    });
 
    const saved = await this._portfolioRepository.create(item);
    return PortfolioMapper.toResponse(saved);
  }
}