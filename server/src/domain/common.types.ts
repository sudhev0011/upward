import { PortfolioItem } from "./entities/portfolio.entity";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PortfolioPaginatedResult {
  items: PortfolioItem[];
  totalCount: number;
}