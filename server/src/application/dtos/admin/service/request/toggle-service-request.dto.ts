import z from "zod";

export const ToggleServiceRequestDtoSchema = z.object({
    serviceId: z.string(),
    isActive: z.boolean()
});

export type ToggleServiceRequestDto = z.infer< typeof ToggleServiceRequestDtoSchema>;