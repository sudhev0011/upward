import { Types } from "mongoose";
import { RepositoryBase } from "./base.repository";
import { AvailabilityOverride } from "../../../../domain/entities/availability-override.entity";
import { AvailabilityOverrideModel, AvailabilityOverrideDocument } from "../models/availability-override.model";
import { AvailabilityOverrideInfraMapper } from "../../../mapers.persistence/availability-override/availability-override-mapper";
export class AvailabilityOverrideRepository extends RepositoryBase<
  AvailabilityOverride,
  AvailabilityOverrideDocument
> {
  constructor() {
    super(AvailabilityOverrideModel);
  }

  async findByProviderId(providerId: string): Promise<AvailabilityOverride[]> {
    return this.findMany({ providerId: new Types.ObjectId(providerId) });
  }

  async findByProviderAndDate(
    providerId: string,
    date: string 
  ): Promise<AvailabilityOverride | null> {
    return this.findOne({
      providerId: new Types.ObjectId(providerId),
      date,
    });
  }

  async findByProviderInDateRange(
    providerId: string,
    startDate: string, 
    endDate: string    
  ): Promise<AvailabilityOverride[]> {
    return this.findMany({
      providerId: new Types.ObjectId(providerId),
      date: { $gte: startDate, $lte: endDate },
    });
  }

  async upsertByProviderAndDate(
    providerId: string,
    date: string,
    data: Partial<AvailabilityOverride>
  ): Promise<AvailabilityOverride> {
    const documentData = this.mapToDocument(data);

    const document = await this.model.findOneAndUpdate(
      { providerId: new Types.ObjectId(providerId), date },
      { ...documentData, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    return this.mapToEntity(document!);
  }

  async deleteByProviderAndDate(
    providerId: string,
    date: string
  ): Promise<boolean> {
    const result = await this.model.findOneAndDelete({
      providerId: new Types.ObjectId(providerId),
      date,
    });

    return result !== null;
  }


  protected mapToEntity(
    document: AvailabilityOverrideDocument
  ): AvailabilityOverride {
    return AvailabilityOverrideInfraMapper.mapToEntity(document)
  }

  protected mapToDocument(
    entity: Partial<AvailabilityOverride>
  ): Partial<AvailabilityOverrideDocument> {
    return AvailabilityOverrideInfraMapper.mapToDocument(entity)
  }
}