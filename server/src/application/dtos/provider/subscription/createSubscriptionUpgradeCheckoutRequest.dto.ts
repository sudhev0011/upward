import { z } from "zod";

export const CreateSubscriptionUpgradeCheckoutRequestDto = z.object({
  planId: z.string().min(1, "planId is required"),
});

export type CreateSubscriptionUpgradeCheckoutRequest = z.infer<
  typeof CreateSubscriptionUpgradeCheckoutRequestDto
> & {
  providerId: string;
};
