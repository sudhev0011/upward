export interface AvailabilityOverrideResponseDto {
  id: string;
  providerId: string;
  date: string;
  isWorking: boolean;
  startTime: string | null; 
  endTime: string | null;   
  createdAt: Date;
  updatedAt: Date;
}