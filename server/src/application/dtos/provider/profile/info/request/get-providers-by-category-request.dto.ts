import { z } from 'zod';

export const GetProvidersByCategoryRequestDtoSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  minRating: z.coerce.number().min(0).max(5).optional(),
  location: z.string().optional(),
  sortBy: z.enum(['ratingAvg', 'createdAt']).default('ratingAvg'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type GetProvidersByCategoryRequestDto = z.infer<
  typeof GetProvidersByCategoryRequestDtoSchema
>;