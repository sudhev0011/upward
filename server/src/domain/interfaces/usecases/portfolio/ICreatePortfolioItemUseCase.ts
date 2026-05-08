import { CreatePortfolioItemRequestDto } from "../../../../application/dtos/provider/portfolio/portfolioRequest.dto";
import { PortfolioItemResponseDto } from "../../../../application/dtos/provider/portfolio/portfolioResponse.dto";

export interface ICreatePortfolioItemUseCase {
  execute(data: CreatePortfolioItemRequestDto): Promise<PortfolioItemResponseDto>;
}