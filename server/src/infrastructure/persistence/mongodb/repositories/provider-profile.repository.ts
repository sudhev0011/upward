import { PipelineStage } from 'mongoose';
import { IProviderProfileRepository } from '../../../../domain/interfaces/repositories/provider/IProviderProfileRepository';
import { ProviderProfile } from '../../../../domain/entities/provider-profile.entity';
import { ProviderProfileModel,ProviderProfileDocument as ModelDocument } from '../models/provider-profile.model';
import { RepositoryBase } from './base.repository';
import { ProviderProfileMapper } from '../../../mapers.persistence/provider/provider-profile.mapper';

export class ProviderProfileRepository extends RepositoryBase<ProviderProfile, ModelDocument> implements IProviderProfileRepository {
  constructor() {
    super(ProviderProfileModel);
  }

  protected mapToEntity(doc: ModelDocument): ProviderProfile {
    return ProviderProfileMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<ProviderProfile>): Partial<ModelDocument> {
    return ProviderProfileMapper.toDocument(entity);
  }

  async getAll(options: {
    page: number;
    limit: number;
    search?: string;
    skills?: string[];
    location?: string;
  }): Promise<{ seekers: (ProviderProfile & { user: { name: string; email: string; _id: string } })[]; total: number }> {
    const { page, limit, search, skills, location } = options;
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
        { headline: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    
    if (skills && skills.length > 0) {
      match.skills = { $in: skills.map(s => new RegExp(s, 'i')) };
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

    const result = await ProviderProfileModel.aggregate(pipeline);
    
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
    return ProviderProfileModel.countDocuments();
  }
}
