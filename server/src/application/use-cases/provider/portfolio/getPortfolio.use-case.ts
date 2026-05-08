import { IPortfolioRepository } from "../../../../domain/interfaces/repositories/portfolio/IPortfolioRepository";
import { IGetPortfolioUseCase } from "../../../../domain/interfaces/usecases/portfolio/IGetPortfolioUseCase";
import { PortfolioItemResponseDto } from "../../../dtos/provider/portfolio/portfolioResponse.dto";
import { PortfolioMapper } from "../../../mapers/provider/portfolio/portfolio,mapper";

export class GetPortfolioUseCase implements IGetPortfolioUseCase {
  constructor(
    private readonly _portfolioRepository: IPortfolioRepository
  ) {}
 
  async execute(providerId: string): Promise<PortfolioItemResponseDto[]> {
    const items = await this._portfolioRepository.findByProviderId(providerId);
    return PortfolioMapper.toResponseList(items);
  }
}