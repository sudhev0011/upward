import { z } from 'zod';

export const CreateClientProfileRequestDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  location: z.string().max(100, 'Location must not exceed 100 characters').optional(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  dateOfBirth: z.string().date('Please enter a valid date of birth').optional(),
  gender: z.string().max(50, 'Gender must not exceed 50 characters').optional(),
});

export type CreateClientProfileRequestDto = z.infer<typeof CreateClientProfileRequestDtoSchema>;


export const CreateSeekerProfileDto = CreateClientProfileRequestDtoSchema;

