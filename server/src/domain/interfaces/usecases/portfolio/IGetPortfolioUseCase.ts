import { PortfolioItemResponseDto } from "../../../../application/dtos/provider/portfolio/portfolioResponse.dto";

export interface IGetPortfolioUseCase {
  execute(providerId: string): Promise<PortfolioItemResponseDto[]>;
}