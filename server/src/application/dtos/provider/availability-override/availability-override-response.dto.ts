export interface AvailabilityOverrideResponseDto {
  id: string;
  providerId: string;
  date: string;             // "YYYY-MM-DD"
  isWorking: boolean;
  startTime: string | null; // "HH:mm"
  endTime: string | null;   // "HH:mm"
  createdAt: Date;
  updatedAt: Date;
}