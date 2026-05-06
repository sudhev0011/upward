import { Types } from "mongoose";
import { RepositoryBase } from "./base.repository";
import {
  Availability,
  DaySchedule,
  WeeklySchedule,
} from "../../../../domain/entities/availability.entity";
import { AvailabilityModel, AvailabilityDocument } from "../models/availability.model";

export class AvailabilityRepository extends RepositoryBase<
  Availability,
  AvailabilityDocument
> {
  constructor() {
    super(AvailabilityModel);
  }

  // Each provider has exactly one availability document
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

  // ─── Mappers ───────────────────────────────────────────────────────────────

  protected mapToEntity(document: AvailabilityDocument): Availability {
    return Availability.create({
      id: document._id.toString(),
      providerId: document.providerId.toString(),
      timezone: document.timezone,
      availabilityWindow: document.availabilityWindow,
      weeklySchedule: this.mapWeeklyScheduleToEntity(document.weeklySchedule),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  protected mapToDocument(
    entity: Partial<Availability>
  ): Partial<AvailabilityDocument> {
    const doc: Record<string, unknown> = {};

    if (entity.providerId !== undefined)
      doc.providerId = new Types.ObjectId(entity.providerId);
    if (entity.timezone !== undefined) doc.timezone = entity.timezone;
    if (entity.availabilityWindow !== undefined)
      doc.availabilityWindow = entity.availabilityWindow;
    if (entity.weeklySchedule !== undefined)
      doc.weeklySchedule = entity.weeklySchedule;

    return doc as Partial<AvailabilityDocument>;
  }

  private mapWeeklyScheduleToEntity(raw: WeeklySchedule): WeeklySchedule {
    const days: (keyof WeeklySchedule)[] = [
      "sunday", "monday", "tuesday", "wednesday",
      "thursday", "friday", "saturday",
    ];

    return days.reduce((acc, day) => {
      const d = raw[day] as DaySchedule;
      acc[day] = {
        isWorking: d.isWorking,
        startTime: d.startTime ?? null,
        endTime: d.endTime ?? null,
      };
      return acc;
    }, {} as WeeklySchedule);
  }
}