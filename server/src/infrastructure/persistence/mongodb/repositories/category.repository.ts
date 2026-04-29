import { Category } from "../../../../domain/entities/category.entity";
import { CategoryDocument, CategoryModel } from "../models/category.model";
import { RepositoryBase } from "./base.repository";
import { CategoryMapper } from "../../../mapers.persistence/category/category.mapper";
import { ICategoryRepository } from "../../../../domain/interfaces/repositories/category/ICategoryRepository";
import { PaginatedResult } from "../../../../domain/common.types";

export class CategoryRepository
  extends RepositoryBase<Category, CategoryDocument>
  implements ICategoryRepository
{
  constructor() {
    super(CategoryModel);
  }

  protected mapToEntity(document: CategoryDocument): Category {
    return CategoryMapper.toEntity(document);
  }

  protected mapToDocument(
    entity: Partial<Category>,
  ): Partial<CategoryDocument> {
    return CategoryMapper.toDocument(entity);
  }

  async findAll(): Promise<Category[]> {
    return this.findMany({});
    
  }

  async findAllActive(): Promise<Category[]> {
    return this.findMany({ isActive: true });
  }

  async getPaginatedCategories({
    page= 1,
    limit= 10,
    search,
    isActive,
    mode,
    sortBy='createdAt',
    sortOrder='desc'
  }:{
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    mode?: "onsite" | "offsite" | "both";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedResult<Category>> {

    const filter: Record<string, unknown> = {};

    if(search){
      filter.$or = [
        {name: {$regex: search, $options: 'i'}},
        {description: {$regex: search, $options: 'i'}}
      ];
    }

    if(isActive !== undefined){
      filter.isActive = isActive;
    }

    if(mode){
      filter.mode = mode;
    }

    return this.paginate(filter, { page, limit, sortBy, sortOrder })
  }
}
