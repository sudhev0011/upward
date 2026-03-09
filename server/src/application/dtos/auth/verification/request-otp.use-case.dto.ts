import z from 'zod';

export const RequestOtpDto = z.object({
  email: z.string().trim().email('Invalid email address'),
});
export type RequestOtpRequestDto = z.infer<typeof RequestOtpDto>; 