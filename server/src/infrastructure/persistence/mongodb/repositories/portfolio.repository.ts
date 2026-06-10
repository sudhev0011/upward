import { Types } from "mongoose";
import { RepositoryBase } from "./base.repository";
import { PortfolioItem } from "../../../../domain/entities/portfolio.entity";
import {
  PortfolioItemModel,
  PortfolioItemDocument,
} from "../models/portfolio.model";
import { IPortfolioRepository } from "../../../../domain/interfaces/repositories/portfolio/IPortfolioRepository";
import { PortfolioPaginatedResult } from "../../../../domain/common.types";
import { PortfolioMapper } from "../../../mapers.persistence/portfolio/portfolio-mapper";
export class PortfolioRepository
  extends RepositoryBase<PortfolioItem, PortfolioItemDocument>
  implements IPortfolioRepository
{
  constructor() {
    super(PortfolioItemModel);
  }

  async findByProviderId(
    providerId: string,
    page: number,
    limit: number,
  ): Promise<PortfolioPaginatedResult> {
    const filter = { providerId: new Types.ObjectId(providerId) };

    const [documents, totalCount] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.model.countDocuments(filter),
    ]);

    return {
      items: documents.map((doc) => this.mapToEntity(doc)),
      totalCount,
    };
  }

  async findByIdAndProviderId(
    id: string,
    providerId: string,
  ): Promise<PortfolioItem | null> {
    const document = await this.model.findOne({
      _id: new Types.ObjectId(id),
      providerId: new Types.ObjectId(providerId),
    });

    return document ? this.mapToEntity(document) : null;
  }

  async updateByIdAndProviderId(
    id: string,
    providerId: string,
    data: Partial<PortfolioItem>,
  ): Promise<PortfolioItem | null> {
    const document = await this.model.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        providerId: new Types.ObjectId(providerId),
      },
      { ...this.mapToDocument(data), updatedAt: new Date() },
      { new: true },
    );

    return document ? this.mapToEntity(document) : null;
  }

  async deleteByIdAndProviderId(
    id: string,
    providerId: string,
  ): Promise<boolean> {
    const result = await this.model.deleteOne({
      _id: new Types.ObjectId(id),
      providerId: new Types.ObjectId(providerId),
    });

    return result.deletedCount > 0;
  }


  protected mapToEntity(document: PortfolioItemDocument): PortfolioItem {
    return PortfolioMapper.mapToEntity(document)
  }

  protected mapToDocument(
    entity: Partial<PortfolioItem>,
  ): Partial<PortfolioItemDocument> {
    return PortfolioMapper.mapToDocument(entity)
  }
}
