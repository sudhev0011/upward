import { UpdatePortfolioItemRequestDto } from "../../../../application/dtos/provider/portfolio/portfolioRequest.dto";
import { PortfolioItemResponseDto } from "../../../../application/dtos/provider/portfolio/portfolioResponse.dto";

export interface IUpdatePortfolioItemUseCase {
  execute(
    id: string,
    providerId: string,
    data: UpdatePortfolioItemRequestDto
  ): Promise<PortfolioItemResponseDto>;
}