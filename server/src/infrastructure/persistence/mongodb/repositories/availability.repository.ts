import { Types } from "mongoose";
import { RepositoryBase } from "./base.repository";
import {
  Availability,
} from "../../../../domain/entities/availability.entity";
import { AvailabilityModel, AvailabilityDocument } from "../models/availability.model";
import { AvailabilityInfraMapper } from "../../../mapers.persistence/availability/availability-mapper";

export class AvailabilityRepository extends RepositoryBase<
  Availability,
  AvailabilityDocument
> {
  constructor() {
    super(AvailabilityModel);
  }

  async findByProviderId(providerId: string): Promise<Availability | null> {
    return this.findOne({ providerId: new Types.ObjectId(providerId) });
  }

  async upsertByProviderId(
    providerId: string,
    data: Partial<Availability>
  ): Promise<Availability> {
    const documentData = this.mapToDocument(data);

    const document = await this.model.findOneAndUpdate(
      { providerId: new Types.ObjectId(providerId) },
      { ...documentData, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    return this.mapToEntity(document!);
  }


  protected mapToEntity(document: AvailabilityDocument): Availability {
    return AvailabilityInfraMapper.mapToEntity(document)
  }

  protected mapToDocument(
    entity: Partial<Availability>
  ): Partial<AvailabilityDocument> {
    return AvailabilityInfraMapper.mapToDocument(entity)
  }

}