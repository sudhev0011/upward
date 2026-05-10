import { IPortfolioRepository } from "../../../../domain/interfaces/repositories/portfolio/IPortfolioRepository";
import { IGetPortfolioUseCase } from "../../../../domain/interfaces/usecases/portfolio/IGetPortfolioUseCase";
import { PortfolioPageResponseDto } from "../../../dtos/provider/portfolio/portfolioResponse.dto";
import { PortfolioMapper } from "../../../mapers/provider/portfolio/portfolio,mapper";
export class GetPortfolioUseCase implements IGetPortfolioUseCase {
  constructor(private readonly _portfolioRepository: IPortfolioRepository) {}
 
  async execute(
    providerId: string,
    page: number,
    limit: number
  ): Promise<PortfolioPageResponseDto> {
    const { items, totalCount } = await this._portfolioRepository.findByProviderId(
      providerId,
      page,
      limit
    );
 
    return PortfolioMapper.toPageResponse(items, totalCount, page, limit);
  }
}