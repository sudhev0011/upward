import { PaginatedResult } from "../../../common.types";
import { Category } from "../../../entities/category.entity";
import { ServiceMode } from "../../../entity.types";
import { IBaseRepository } from "../base/IBaseRepository";

export interface ICategoryRepository extends IBaseRepository<Category> {
  findAll(): Promise<Category[]>;
  findAllActive(): Promise<Category[]>;
  getPaginatedCategories(query: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    mode?: ServiceMode;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResult<Category>>;
}