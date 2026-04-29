import { Service } from "../../../../domain/entities/service.entity";
import { ServiceDocument, ServiceModel } from "../models/service.model";
import { RepositoryBase } from "./base.repository";
import { ServiceMapper } from "../../../mapers.persistence/service/ServiceMapper";
import { Types } from "mongoose";
import { IServiceRepository } from "../../../../domain/interfaces/repositories/service/IServiceRepository";

export class ServiceRepository
  extends RepositoryBase<Service, ServiceDocument>
  implements IServiceRepository
{
  constructor() {
    super(ServiceModel);
  }
  protected mapToEntity(document: ServiceDocument): Service {
    return ServiceMapper.toEntity(document);
  }

  protected mapToDocument(entity: Partial<Service>): Partial<ServiceDocument> {
    return ServiceMapper.toDocument(entity);
  }

  async findByCategory(categoryId: string): Promise<Service[]> {
    return this.findMany({
      categoryId: new Types.ObjectId(categoryId),
      isActive: true,
    });
  }

  async findAllActive(): Promise<Service[]> {
    return this.findMany({ isActive: true });
  }
  
  async findAll(): Promise<Service[]>{
    return this.findMany({});
  }

  async getPaginatedServices({
  page = 1,
  limit = 10,
  search,
  isActive,
  mode,
  categoryId,
  sortBy = "createdAt",
  sortOrder = "desc",
}: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  mode?: "onsite" | "offsite" | "both";
  categoryId?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}) {
  const filter: Record<string, unknown> = {};

  // 🔍 Search
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // ✅ Active filter
  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  // ✅ Mode filter (with "both" logic)
  if (mode) {
    if (mode === "onsite") {
      filter.mode = { $in: ["onsite", "both"] };
    } else if (mode === "offsite") {
      filter.mode = { $in: ["offsite", "both"] };
    } else {
      filter.mode = "both";
    }
  }

  // ✅ Category filter
  if (categoryId) {
    filter.categoryId = new Types.ObjectId(categoryId);
  }

  // 🔒 Safe sorting
  const allowedSortFields = ["name", "createdAt"];
  if (!allowedSortFields.includes(sortBy)) {
    sortBy = "createdAt";
  }

  return this.paginate(filter, {
    page,
    limit,
    sortBy,
    sortOrder,
  });
}

}
