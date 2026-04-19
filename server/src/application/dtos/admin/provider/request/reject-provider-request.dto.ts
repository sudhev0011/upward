import { z } from 'zod';

export const RejectProviderDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  isApprovedByAdmin: z.boolean(),
  reason: z.string().min(1,'Give atleast one comment')
});

export type RejectProviderDto = z.infer<typeof RejectProviderDtoSchema>;
