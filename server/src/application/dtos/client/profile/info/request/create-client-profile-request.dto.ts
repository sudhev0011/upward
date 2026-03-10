import { z } from 'zod';

export const CreateClientProfileRequestDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  location: z.string().max(100, 'Location must not exceed 100 characters').optional(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number').optional(),
});

export type CreateClientProfileRequestDto = z.infer<typeof CreateClientProfileRequestDtoSchema>;