import { PortfolioPageResponseDto } from "../../../../application/dtos/provider/portfolio/portfolioResponse.dto";

export interface IGetPortfolioUseCase {
  execute(providerId: string, page: number, limit: number): Promise<PortfolioPageResponseDto>;
}