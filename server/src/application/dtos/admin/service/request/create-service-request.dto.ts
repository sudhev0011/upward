import z from "zod";

export const CreateServiceRequestDtoSchema = z.object({
    categoryId: z.string(),
    name: z.string().min(1,"name required for service"),
    description: z.string().min(1,"description required").optional(),
    maxHour: z.number().nullable(),
    mode: z.enum(['onsite', 'offsite', 'both']),
    isActive: z.boolean()
})

export type CreateServiceRequestDto = z.infer<typeof CreateServiceRequestDtoSchema>;