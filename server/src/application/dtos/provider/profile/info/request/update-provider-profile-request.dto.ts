import { z } from 'zod';

const SocialLinkSchema = z.object({
  name: z.string().min(1, 'Social link name is required'),
  link: z.string().url('Please enter a valid URL'),
});

export const UpdateProviderProfileRequestDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  bio: z.string().max(2000, 'Summary must not exceed 2000 characters').optional(),
  location: z.string().trim().min(3,"Enter a valid location").max(100, 'Location must not exceed 100 characters').optional(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number').optional(),
  dateOfBirth: z.string().date('Please enter a valid date of birth').optional(),
  gender: z.string().max(50, 'Gender must not exceed 50 characters').optional(),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  experience: z.string().min(0,'cannot have negative experince').optional(),
  ratingCount: z.number().min(0, 'cannot be negative').optional(),
  ratingAvg: z.number().optional(),
  isApprovedByAdmin: z.boolean().optional(),
  socialLinks: z.array(SocialLinkSchema).optional(),
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters').optional(),
  avatarUrl: z.string().optional(),
});

export type UpdateProviderProfileRequestDto = z.infer<typeof UpdateProviderProfileRequestDtoSchema>;