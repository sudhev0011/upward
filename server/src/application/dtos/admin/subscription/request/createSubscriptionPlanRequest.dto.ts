import { PlanFeatures } from "../../../../../domain/interfaces/subscription-plan.interface";
import { z } from "zod";

// export interface CreateSubscriptionPlanRequest {
//   name: string;
//   price: number;
//   billingCycle: "monthly" | "yearly";
//   features: Partial<PlanFeatures>;
//   isActive?: boolean;
// }


const PlanFeaturesSchema = z.object({
  maxServices: z.number().int().min(0, "maxServices must be 0 or greater"),
  maxPortfolios: z.number().int().min(0, "maxPortfolios must be 0 or greater"),
  maxManualUnavailability: z.number().int().min(0, "maxManualUnavailability must be 0 or greater"),
});

export const CreateSubscriptionPlanRequestDto = z.object({
  name: z.string().trim().min(1, "Name cannot be empty"),
  price: z.number().min(0, "Price cannot be negative"),
  billingCycle: z.enum(["monthly", "yearly"]),
  features: PlanFeaturesSchema.partial().optional(),
  isActive: z.boolean().optional(),
});


export const UpdateSubscriptionPlanRequestDto = CreateSubscriptionPlanRequestDto.partial();

export type CreateSubscriptionPlanRequest = z.infer<typeof CreateSubscriptionPlanRequestDto>;
export type UpdateSubscriptionPlanRequest = z.infer<typeof UpdateSubscriptionPlanRequestDto>;