import { z } from 'zod';

export const BlockClientRequestDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  isBlocked: z.boolean(),
});

export type BlockClientRequestDto = z.infer<typeof BlockClientRequestDtoSchema>;