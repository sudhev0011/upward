import z from "zod";

export const setProviderServicePriceRequestDtoSchema = z.object({
    providerServiceId: z.string(),
    price: z.number().nonnegative().min(1),
    dailyCapacity: z.number().nonnegative().min(1,"atleast one project should be selected").max(5).nullable()
});

export type setProviderServicePriceRequestDto = z.infer<typeof setProviderServicePriceRequestDtoSchema>;