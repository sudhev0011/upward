import { PortfolioItem } from "../../../../domain/entities/portfolio.entity";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IPortfolioRepository extends IBaseRepository<PortfolioItem> {
  findByProviderId(providerId: string): Promise<PortfolioItem[]>;
  findByIdAndProviderId(id: string, providerId: string): Promise<PortfolioItem | null>;
  updateByIdAndProviderId(
    id: string,
    providerId: string,
    data: Partial<PortfolioItem>
  ): Promise<PortfolioItem | null>;
  deleteByIdAndProviderId(id: string, providerId: string): Promise<boolean>;
}