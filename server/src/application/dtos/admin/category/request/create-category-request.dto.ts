import z from "zod";

export const CreateCategoryRequestDtoSchema = z.object({
    name: z.string().min(1,"cannot leave name as empty").max(15,'cannot keep a name this much long'),
    description: z.string().min(1,"cannot leave empty description").max(25,'cannot keep this much long').optional(),
    mode: z.enum(['onsite', 'offsite', 'both']),
    isActive: z.boolean()
});

export type CreateCategoryRequestDto = z.infer< typeof CreateCategoryRequestDtoSchema>