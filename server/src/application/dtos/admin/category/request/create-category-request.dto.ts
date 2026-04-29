import z from "zod";

export const CreateCategoryRequestDtoSchema = z.object({
    name: z.string().min(1,"cannot leave name as empty"),
    description: z.string().min(1,"cannot leave empty description").optional(),
    mode: z.enum(['onsite', 'offsite', 'both']),
    isActive: z.boolean()
});

export type CreateCategoryRequestDto = z.infer< typeof CreateCategoryRequestDtoSchema>