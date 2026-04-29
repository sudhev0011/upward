import { PaginatedResult } from "../../../common.types";
import { Service } from "../../../entities/service.entity";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IServiceRepository extends IBaseRepository<Service>{
  findByCategory(categoryId: string): Promise<Service[]>;

  findAllActive(): Promise<Service[]>;

  findAll(): Promise<Service[]>

  getPaginatedServices(query: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    mode?: "onsite" | "offsite" | "both";
    categoryId?: string;
    sortBy?: "name" | "createdAt";
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedResult<Service>>;
}