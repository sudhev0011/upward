import { Types } from "mongoose";
import { RepositoryBase } from "./base.repository";
import { AvailabilityOverride } from "../../../../domain/entities/availability-override.entity";
import { AvailabilityOverrideModel, AvailabilityOverrideDocument } from "../models/availability-override.model";
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

  // Fetch the override for a specific date — used in slot resolution
  async findByProviderAndDate(
    providerId: string,
    date: string // "YYYY-MM-DD"
  ): Promise<AvailabilityOverride | null> {
    return this.findOne({
      providerId: new Types.ObjectId(providerId),
      date,
    });
  }

  // Fetch all overrides within a date range — useful for rendering a week/month calendar view
  async findByProviderInDateRange(
    providerId: string,
    startDate: string, // "YYYY-MM-DD"
    endDate: string    // "YYYY-MM-DD"
  ): Promise<AvailabilityOverride[]> {
    return this.findMany({
      providerId: new Types.ObjectId(providerId),
      date: { $gte: startDate, $lte: endDate },
    });
  }

  // Upsert — provider can only have one override per date (enforced by unique index too)
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

  // ─── Mappers ───────────────────────────────────────────────────────────────

  protected mapToEntity(
    document: AvailabilityOverrideDocument
  ): AvailabilityOverride {
    return AvailabilityOverride.create({
      id: document._id.toString(),
      providerId: document.providerId.toString(),
      date: document.date,
      isWorking: document.isWorking,
      startTime: document.startTime ?? null,
      endTime: document.endTime ?? null,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  protected mapToDocument(
    entity: Partial<AvailabilityOverride>
  ): Partial<AvailabilityOverrideDocument> {
    const doc: Record<string, unknown> = {};

    if (entity.providerId !== undefined)
      doc.providerId = new Types.ObjectId(entity.providerId);
    if (entity.date !== undefined) doc.date = entity.date;
    if (entity.isWorking !== undefined) doc.isWorking = entity.isWorking;
    if (entity.startTime !== undefined) doc.startTime = entity.startTime;
    if (entity.endTime !== undefined) doc.endTime = entity.endTime;

    return doc as Partial<AvailabilityOverrideDocument>;
  }
}