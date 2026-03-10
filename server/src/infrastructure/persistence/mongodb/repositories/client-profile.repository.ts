import { PipelineStage } from 'mongoose';
import { IClientProfileRepository } from '../../../../domain/interfaces/repositories/client/IClientProfileRepository';
import { ClientProfile } from '../../../../domain/entities/client-profile.entity';
import { ClientProfileModel,ClientProfileDocument as ModelDocument } from '../models/client-profile.model';
import { RepositoryBase } from './base.repository';
import { ClientProfileMapper } from '../../../mapers.persistence/client/client-profile.mapper';

export class ClientProfileRepository extends RepositoryBase<ClientProfile, ModelDocument> implements IClientProfileRepository {
  constructor() {
    super(ClientProfileModel);
  }

  protected mapToEntity(doc: ModelDocument): ClientProfile {
    return ClientProfileMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<ClientProfile>): Partial<ModelDocument> {
    return ClientProfileMapper.toDocument(entity);
  }

  async getAll(options: {
    page: number;
    limit: number;
    search?: string;
    location?: string;
  }): Promise<{ seekers: (ClientProfile & { user: { name: string; email: string; _id: string } })[]; total: number }> {
    const { page, limit, search, location } = options;
    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [];

    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    });

    pipeline.push({ $unwind: '$user' });

    const match: Record<string, unknown> = {};

    if (search) {
      match.$or = [
        { 'user.name': { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      match.location = { $regex: location, $options: 'i' };
    }

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    const facetStage = {
      $facet: {
        docs: [
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [
          { $count: 'count' },
        ],
      },
    };
    pipeline.push(facetStage);

    const result = await ClientProfileModel.aggregate(pipeline);
    
    const docs = result[0].docs;
    const total = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;

    const seekers = docs.map((doc: ModelDocument & { user: { name: string; email: string; _id: unknown } }) => {
      const entity = this.mapToEntity(doc);
      return {
        ...entity,
         
        user: {
          name: doc.user.name,
          email: doc.user.email,
          _id: String(doc.user._id),
        },
      };
    });

    return { seekers, total };
  }

  async countTotal(): Promise<number> {
    return ClientProfileModel.countDocuments();
  }
}
