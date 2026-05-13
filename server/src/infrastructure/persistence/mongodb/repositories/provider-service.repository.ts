import { ProviderService } from "../../../../domain/entities/provider-service.entity";
import {
  ProviderServiceDocument,
  ProviderServiceModel,
} from "../models/provider-service.model";
import { RepositoryBase } from "./base.repository";
import { ProviderServiceMapper } from "../../../mapers.persistence/provider/provider-service.mapper";
import { Types, PipelineStage } from "mongoose";
import { IProviderServiceRepository } from "../../../../domain/interfaces/repositories/provider/IProviderServiceRepository";
import { ProviderServicesGroupedData } from "../../../../domain/queries/provider/ProviderServicesQueryModel";
import { PaginatedResult } from "../../../../domain/common.types";
import { ProviderServicePublicItem } from "../../../../domain/queries/client/provider-service-public-item";
import { ProviderServiceStatus } from "../../../../domain/enums/provider-service.status.enum";

export class ProviderServiceRepository
  extends RepositoryBase<ProviderService, ProviderServiceDocument>
  implements IProviderServiceRepository
{
  constructor() {
    super(ProviderServiceModel);
  }

  protected mapToEntity(document: ProviderServiceDocument): ProviderService {
    return ProviderServiceMapper.toEntity(document);
  }

  protected mapToDocument(
    entity: Partial<ProviderService>,
  ): Partial<ProviderServiceDocument> {
    return ProviderServiceMapper.toDocument(entity);
  }

  async findByProvider(providerId: string): Promise<ProviderService[]> {
    return this.findMany({
      providerId: new Types.ObjectId(providerId),
    });
  }

  async findByProviderAndService(
    providerId: string,
    serviceId: string,
  ): Promise<ProviderService | null> {
    return this.findOne({
      providerId: new Types.ObjectId(providerId),
      serviceId: new Types.ObjectId(serviceId),
    });
  }

  async findGroupedByCategory(
    providerId: string,
    params: {
      page?: number;
      limit?: number;
      search?: string;
      isActive?: boolean;
      mode?: "onsite" | "offsite" | "both";
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    },
  ): Promise<PaginatedResult<ProviderServicesGroupedData>> {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      mode,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const skip = (page - 1) * limit;

    // 1. Build Initial Match (Filters on ProviderService collection)
    const matchQuery: Record<string, unknown> = {
      providerId: new Types.ObjectId(providerId),
    };

    // Filter by isActive boolean if provided
    if (typeof isActive === "boolean") {
      matchQuery.isActive = isActive;
    }

    const pipeline: PipelineStage[] = [
      { $match: matchQuery },

      // Join services (needed for search/mode filters and grouping)
      {
        $lookup: {
          from: "services", // Ensure this matches your Service collection name
          localField: "serviceId",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
    ];

    // 2. Filter by Service attributes (Search or Mode)
    if (search || mode) {
      const serviceMatch: Record<string, unknown> = {};
      if (search) {
        serviceMatch["service.name"] = { $regex: search, $options: "i" };
      }
      if (mode) {
        serviceMatch["service.mode"] = mode;
      }
      pipeline.push({ $match: serviceMatch });
    }

    // 3. Use Facet for parallel Count and Paginated Data
    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        docs: [
          // Sort and Paginate the individual services first
          { $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 } },
          { $skip: skip },
          { $limit: limit },

          // Join categories for the paginated services
          {
            $lookup: {
              from: "categories", // Ensure this matches your Category collection name
              localField: "service.categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: "$category" },

          // Group the paginated results by category
          {
            $group: {
              _id: "$category._id",
              categoryName: { $first: "$category.name" },
              services: {
                $push: {
                  providerServiceId: "$_id",
                  serviceId: "$service._id",
                  serviceName: "$service.name",
                  mode: "$service.mode",
                  maxHour: "$service.maxHour",
                  price: "$price",
                  status: "$status",
                  isActive: "$isActive",
                },
              },
            },
          },

          // Final Output Projection
          {
            $project: {
              _id: 0,
              category: { id: "$_id", name: "$categoryName" },
              services: 1,
            },
          },
        ],
      },
    });

    const [result] = await this.model.aggregate(pipeline);

    const total = result.metadata[0]?.total || 0;
    const data = result.docs || [];

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getActiveServicesByProvider(providerId: string): Promise<ProviderServicePublicItem[]> {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        providerId: new Types.ObjectId(providerId),
        status: ProviderServiceStatus.ACTIVE,
        isActive: true,
      },
    },
    {
      $lookup: {
        from: 'services',
        localField: 'serviceId',
        foreignField: '_id',
        as: 'service',
      },
    },
    { $unwind: '$service' },
    {
      $lookup: {
        from: 'categories',
        localField: 'service.categoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $project: {
        _id: 0,
        providerServiceId: '$_id',
        serviceName: '$service.name',
        mode: '$service.mode',
        maxHour: '$service.maxHour',
        price: '$price',
        categoryName: '$category.name',
      },
    },
    { $sort: { categoryName: 1, serviceName: 1 } },
  ];

  return ProviderServiceModel.aggregate(pipeline);
}
}
