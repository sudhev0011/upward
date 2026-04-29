import z from "zod";

export const setProviderServicePriceRequestDtoSchema = z.object({
    providerServiceId: z.string(),
    price: z.number().nonnegative().min(1)
});

export type setProviderServicePriceRequestDto = z.infer<typeof setProviderServicePriceRequestDtoSchema>;