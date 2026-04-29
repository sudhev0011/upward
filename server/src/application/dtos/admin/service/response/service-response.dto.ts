export interface ServiceResponseDto {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  mode: "onsite" | "offsite" | "both";
  maxHour: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
