import { z } from 'zod';

export const ApproveProviderDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  isApprovedByAdmin: z.boolean(),
});

export type ApproveProviderDto = z.infer<typeof ApproveProviderDtoSchema>;
