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
import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { MongoSessionUtil } from "../helper/mongo-session.utils";

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

  async findByProvider(
    providerId: string,
    transaction?: ITransactionContext,
  ): Promise<ProviderService[]> {
    const session = MongoSessionUtil.getSession(transaction);
    return this.findMany(
      {
        providerId: new Types.ObjectId(providerId),
      },
      session,
    );
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

    const matchQuery: Record<string, unknown> = {
      providerId: new Types.ObjectId(providerId),
    };

    if (typeof isActive === "boolean") {
      matchQuery.isActive = isActive;
    }

    const pipeline: PipelineStage[] = [
      { $match: matchQuery },

      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
    ];

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

    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        docs: [
          { $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 } },
          { $skip: skip },
          { $limit: limit },

          {
            $lookup: {
              from: "categories",
              localField: "service.categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: "$category" },

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
                  dailyCapacity: "$dailyCapacity",
                  status: "$status",
                  isActive: "$isActive",
                },
              },
            },
          },

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

  async getActiveServicesByProvider(
    providerId: string,
  ): Promise<ProviderServicePublicItem[]> {
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
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      {
        $lookup: {
          from: "categories",
          localField: "service.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          providerServiceId: "$_id",
          serviceName: "$service.name",
          mode: "$service.mode",
          maxHour: "$service.maxHour",
          price: "$price",
          dailyCapacity: "$dailyCapacity",
          categoryName: "$category.name",
        },
      },
      { $sort: { categoryName: 1, serviceName: 1 } },
    ];

    return ProviderServiceModel.aggregate(pipeline);
  }

  async findActive(
    providerId: string,
    serviceId: string,
    transaction?: ITransactionContext,
  ): Promise<ProviderService | null> {
    const session = MongoSessionUtil.getSession(transaction);
    const count = this.countDocuments({ providerId });
    return this.findOne(
      {
        providerId,
        serviceId,
        isActive: true,
      },
      session,
    );
  }

  async servicesCountByProvider(
    providerId: string,
    transaction?: ITransactionContext,
  ): Promise<number> {
    const session = MongoSessionUtil.getSession(transaction);
    return this.countDocuments(
      {
        providerId,
      },
      session,
    );
  }

  async hasOtherServicesInSameCategory(
  providerServiceId: string,
): Promise<{
  hasOtherServices: boolean;
  categoryId: string;
  categoryName: string;
  providerId: string;
}> {
  const result = await this.model.aggregate([
    // Stage 1: Find the provider service being deleted
    {
      $match: {
        _id: new Types.ObjectId(providerServiceId),
        isActive: true,
      },
    },
    // Stage 2: Lookup the service details to get categoryId
    {
      $lookup: {
        from: "services",
        localField: "serviceId",
        foreignField: "_id",
        as: "service",
      },
    },
    // Stage 3: Unwind the service array
    {
      $unwind: {
        path: "$service",
        preserveNullAndEmptyArrays: false,
      },
    },
    // Stage 4: Lookup category details to get category name
    {
      $lookup: {
        from: "categories",
        localField: "service.categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    // Stage 5: Unwind the category array
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: false,
      },
    },
    // Stage 6: Lookup all services in the same category
    {
      $lookup: {
        from: "services",
        let: { categoryId: "$service.categoryId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$categoryId", "$$categoryId"] },
                  { $eq: ["$isActive", true] },
                ],
              },
            },
          },
          { $project: { _id: 1 } },
        ],
        as: "servicesInCategory",
      },
    },
    // Stage 7: Lookup all provider services for these services
    // Excluding the one being deleted
    {
      $lookup: {
        from: "providerservices",
        let: {
          serviceIds: "$servicesInCategory._id",
          currentProviderId: "$providerId",
          currentServiceId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ["$serviceId", "$$serviceIds"] },
                  { $eq: ["$providerId", "$$currentProviderId"] },
                  { $ne: ["$_id", "$$currentServiceId"] },
                  { $eq: ["$isActive", true] },
                ],
              },
            },
          },
          { $limit: 1 }, // We only need to know if at least one exists
          { $project: { _id: 1 } },
        ],
        as: "otherProviderServices",
      },
    },
    // Stage 8: Project the result with all needed information
    {
      $project: {
        hasOtherServices: {
          $gt: [{ $size: "$otherProviderServices" }, 0],
        },
        categoryId: "$service.categoryId",
        categoryName: "$category.name",
        providerId: "$providerId",
        otherServicesCount: { $size: "$otherProviderServices" },
      },
    },
  ]);

  // If no result found, the provider service doesn't exist or is inactive
  if (result.length === 0) {
    return {
      hasOtherServices: false,
      categoryId: result[0].categoryId,
      categoryName: result[0].categoryName,
      providerId: result[0].providerId,
    };
  }

  console.log(result[0]);
  return result[0];
}
}
