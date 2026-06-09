import { clientApi } from "@/api/client.api";
import { WalletResponse } from "@/interfaces/bookings/bookings.interface";
import { useQuery } from "@tanstack/react-query";

export const useGetWallet = () => {
  return useQuery<WalletResponse>({
    queryKey: ["client-wallet"],
    queryFn: async () => {
      const response = await clientApi.getWallet();
      return response.data!;
    },
  });
};
