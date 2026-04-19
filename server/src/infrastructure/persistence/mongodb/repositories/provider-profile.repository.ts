import { PipelineStage } from "mongoose";
import { IProviderProfileRepository } from "../../../../domain/interfaces/repositories/provider/IProviderProfileRepository";
import { ProviderProfile } from "../../../../domain/entities/provider-profile.entity";
import {
  ProviderProfileModel,
  ProviderProfileDocument as ModelDocument,
} from "../models/provider-profile.model";
import { RepositoryBase } from "./base.repository";
import { ProviderProfileMapper } from "../../../mapers.persistence/provider/provider-profile.mapper";
import { ProviderListItem } from "../../../../domain/queries/provider/ProviderQueryModel";

export class ProviderProfileRepository
  extends RepositoryBase<ProviderProfile, ModelDocument>
  implements IProviderProfileRepository
{
  constructor() {
    super(ProviderProfileModel);
  }

  protected mapToEntity(doc: ModelDocument): ProviderProfile {
    return ProviderProfileMapper.toEntity(doc);
  }

  protected mapToDocument(
    entity: Partial<ProviderProfile>,
  ): Partial<ModelDocument> {
    return ProviderProfileMapper.toDocument(entity);
  }

  async getAll(options: {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isBlocked?: boolean;
  isApprovedByAdmin?: boolean;
}): Promise<{
  providers: ProviderListItem[];
  total: number;
}> {
  const { 
    page, 
    limit, 
    search, 
    sortBy = 'createdAt', 
    sortOrder = 'desc', 
    isBlocked, 
    isApprovedByAdmin 
  } = options;

  const skip = (page - 1) * limit;
  const pipeline: PipelineStage[] = [];

  // 1. Initial Match for Provider-specific filters (Performance: filter before lookup)
  const providerMatch: any = {};
  if (isApprovedByAdmin !== undefined) {
    providerMatch.isApprovedByAdmin = isApprovedByAdmin;
  }
  if (Object.keys(providerMatch).length > 0) {
    pipeline.push({ $match: providerMatch });
  }

  // 2. Lookup User Data
  pipeline.push({
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user",
    },
  });

  pipeline.push({ $unwind: "$user" });

  // 3. Match for User-specific filters and Global Search
  const secondaryMatch: any = {};

  if (isBlocked !== undefined) {
    secondaryMatch["user.isBlocked"] = isBlocked;
  }

  if (search) {
    secondaryMatch.$or = [
      { bio: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { "user.name": { $regex: search, $options: "i" } },
      { skills: { $in: [new RegExp(search, "i")] } },
    ];
  }

  if (Object.keys(secondaryMatch).length > 0) {
    pipeline.push({ $match: secondaryMatch });
  }

  // 4. Sorting
  // Mapping 'name' or 'email' to 'user.name' etc., if the user tries to sort by joined fields
  const sortField = (sortBy === 'name' || sortBy === 'email') ? `user.${sortBy}` : sortBy;
  pipeline.push({
    $sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 }
  });

  // 5. Facet for Pagination and Totals
  pipeline.push({
    $facet: {
      docs: [{ $skip: skip }, { $limit: limit }],
      totalCount: [{ $count: "count" }],
    },
  });

  const result = await ProviderProfileModel.aggregate(pipeline);
  
  const docs = result[0].docs || [];
  const total = result[0].totalCount[0]?.count || 0;

  const providers = docs.map((doc: any) => {
    const entity = this.mapToEntity(doc);
    return {
      ...entity,
      name: doc.user.name,
      email: doc.user.email,
      isBlocked: doc.user.isBlocked,
      isVerified: doc.user.isVerified,
    };
  });

  return { providers, total };
}

  async countTotal(): Promise<number> {
    return ProviderProfileModel.countDocuments();
  }
}
