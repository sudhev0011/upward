import { PipelineStage } from "mongoose";
import { IClientProfileRepository } from "../../../../domain/interfaces/repositories/client/IClientProfileRepository";
import { ClientProfile } from "../../../../domain/entities/client-profile.entity";
import {
  ClientProfileModel,
  ClientProfileDocument as ModelDocument,
} from "../models/client-profile.model";
import { RepositoryBase } from "./base.repository";
import { ClientProfileMapper } from "../../../mapers.persistence/client/client-profile.mapper";
import { ClientQueryModel } from "../../../../domain/queries/provider/ClientQueryModel";

export class ClientProfileRepository
  extends RepositoryBase<ClientProfile, ModelDocument>
  implements IClientProfileRepository
{
  constructor() {
    super(ClientProfileModel);
  }

  protected mapToEntity(doc: ModelDocument): ClientProfile {
    return ClientProfileMapper.toEntity(doc);
  }

  protected mapToDocument(
    entity: Partial<ClientProfile>,
  ): Partial<ModelDocument> {
    return ClientProfileMapper.toDocument(entity);
  }

  async getAll(options: {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isBlocked?: boolean;
}): Promise<{ clients: ClientQueryModel[]; total: number }> {
  const { 
    page, 
    limit, 
    search, 
    sortBy = 'createdAt', 
    sortOrder = 'desc', 
    isBlocked 
  } = options;

  const skip = (page - 1) * limit;
  const pipeline: PipelineStage[] = [];

  // 1. Join with User Collection
  pipeline.push({
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user",
    },
  });

  pipeline.push({ $unwind: "$user" });

  // 2. Build Match Object
  const match: Record<string, unknown> = {};

  // Filter by Blocked status
  if (isBlocked !== undefined) {
    match["user.isBlocked"] = isBlocked;
  }

  // Unified Search (Name, Email, Location, or Phone)
  if (search) {
    match.$or = [
      { "user.name": { $regex: search, $options: "i" } },
      { "user.email": { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } }
    ];
  }

  if (Object.keys(match).length > 0) {
    pipeline.push({ $match: match });
  }

  // 3. Dynamic Sorting
  const sortField = (sortBy === 'name' || sortBy === 'email') ? `user.${sortBy}` : sortBy;
  pipeline.push({
    $sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 }
  });

  // 4. Execution with Facet
  pipeline.push({
    $facet: {
      docs: [{ $skip: skip }, { $limit: limit }],
      totalCount: [{ $count: "count" }],
    },
  });

  const result = await ClientProfileModel.aggregate(pipeline);

  const docs = result[0].docs || [];
  const total = result[0].totalCount[0]?.count || 0;

  // 5. Map to Entity
  const clients = docs.map((doc: any) => {
    const entity = this.mapToEntity(doc);
    return {
      ...entity,
      name: doc.user.name,
      email: doc.user.email,
      isBlocked: doc.user.isBlocked,
      isVerified: doc.user.isVerified,
    };
  });

  return { clients, total };
}

  async countTotal(): Promise<number> {
    return ClientProfileModel.countDocuments();
  }
}
