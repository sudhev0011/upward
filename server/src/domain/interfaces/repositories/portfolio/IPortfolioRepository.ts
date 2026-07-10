import { PortfolioItem } from "../../../../domain/entities/portfolio.entity";
import { PortfolioPaginatedResult } from "../../../common.types";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IPortfolioRepository extends IBaseRepository<PortfolioItem> {
  findByProviderId(
    providerId: string,
    page: number,
    limit: number
  ): Promise<PortfolioPaginatedResult>;
  findByIdAndProviderId(id: string, providerId: string): Promise<PortfolioItem | null>;
  updateByIdAndProviderId(
    id: string,
    providerId: string,
    data: Partial<PortfolioItem>
  ): Promise<PortfolioItem | null>;
  deleteByIdAndProviderId(id: string, providerId: string): Promise<boolean>;

  portfoliosCountByProvider(providerId: string): Promise<number>;
}