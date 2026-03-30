import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Building2 } from "lucide-react";
import { KycIdentityForm } from "@/components/provider/kyc/KycIdentityForm";
import { KycBankForm } from "@/components/provider/kyc/KycBankForm";
import { useGetKycDocument } from "@/hooks/provider/useGetKycDocument";
import { useGetBankDocument } from "@/hooks/provider/useGetBankDocument";
import { Skeleton } from "@/components/ui/skeleton";

export default function KycPage() {
  const { data: identityData, isLoading: isLoadingIdentity } = useGetKycDocument();
  const { data: bankData, isLoading: isLoadingBank } = useGetBankDocument();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">KYC & Bank Details</h1>
        <p className="text-muted-foreground mt-1.5">Verify your identity and set up payment information.</p>
      </div>

      <Tabs defaultValue="kyc" className="w-full">
        <TabsList className="w-full sm:w-auto bg-secondary/50 rounded-xl p-1">
          <TabsTrigger
            value="kyc"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6"
          >
            <ShieldCheck className="h-4 w-4 mr-2" /> KYC Verification
          </TabsTrigger>
          <TabsTrigger
            value="bank"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6"
          >
            <Building2 className="h-4 w-4 mr-2" /> Bank Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kyc" className="mt-6">
          {isLoadingIdentity ? (
            <Skeleton className="h-[480px] w-full rounded-2xl" />
          ) : (
            <KycIdentityForm existingData={identityData?.data ?? undefined} />
          )}
        </TabsContent>

        <TabsContent value="bank" className="mt-6">
          {isLoadingBank ? (
            <Skeleton className="h-[480px] w-full rounded-2xl" />
          ) : (
            <KycBankForm existingData={bankData?.data ?? null} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}