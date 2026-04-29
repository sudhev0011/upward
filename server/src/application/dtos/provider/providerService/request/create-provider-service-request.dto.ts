import z from "zod";

export const CreateProviderServiceRequestDtoSchema = z.object({
    providerId: z.string(),
    serviceId: z.string()
})

export type CreateProviderServiceRequestDto = z.infer<typeof CreateProviderServiceRequestDtoSchema>