import { z } from 'zod';
import { UserRole } from '../../../../domain/enums/user-role.enum';

export const RegisterDto = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().trim().min(6, 'Password must be at least 6 characters').regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .regex(/^\S*$/, 'Password must not contain spaces'),
  
  roles: z.array(z.nativeEnum(UserRole)).optional().default([UserRole.CLIENT]),
});

export type RegisterRequestDto = z.infer<typeof RegisterDto>;
