// 🔹 Request DTO
export interface SetAvailabilityOverrideRequest {
  date: string; // "YYYY-MM-DD"
  isWorking: boolean;
  startTime?: string | null; // "HH:mm"
  endTime?: string | null;   // "HH:mm"
}

// 🔹 Response DTO
export interface AvailabilityOverride {
  id: string;
  providerId: string;
  date: string; // "YYYY-MM-DD"
  isWorking: boolean;
  startTime: string | null;
  endTime: string | null;
  createdAt: string;
  updatedAt: string;
}