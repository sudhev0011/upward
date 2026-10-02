import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAdminPaymentsQuery } from "@/hooks/admin/useGetAdminPaymentsQuery";
import { useGetAdminPayoutRequests } from "@/hooks/admin/useGetAdminPayoutRequests";
import { useProcessPayoutRequest } from "@/hooks/admin/useProcessPayoutRequest";
import { AdminPaymentRecord } from "@/interfaces/admin/payments.interface";
import { AdminPayoutRequestItem } from "@/interfaces/admin/payout-request.interface";
import {
  PaymentDetailsDialog,
  PayoutRequestDialog,
  PaymentsLedgerTable,
  PayoutRequestsTable,
} from "@/components/admin/payments";

export default function Payments() {
  const [activeTab, setActiveTab] = useState<"payments" | "payout-requests">(
    "payments",
  );

  const [paymentParams, setPaymentParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    transactionStatus: undefined as string | undefined,
  });

  const [payoutParams, setPayoutParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: undefined as string | undefined,
  });

  const [selectedPayment, setSelectedPayment] =
    useState<AdminPaymentRecord | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<AdminPayoutRequestItem | null>(null);

  const { data: paymentsResponse, isLoading: isLoadingPayments } =
    useGetAdminPaymentsQuery({
      page: paymentParams.page,
      limit: paymentParams.limit,
      search: paymentParams.search,
      transactionStatus:
        paymentParams.transactionStatus === "all"
          ? undefined
          : paymentParams.transactionStatus,
    });

  const { data: payoutRequestsResponse, isLoading: isLoadingPayoutRequests } =
    useGetAdminPayoutRequests({
      page: payoutParams.page,
      limit: payoutParams.limit,
      search: payoutParams.search.trim() || undefined,
      status:
        payoutParams.status === "all" ? undefined : payoutParams.status,
    });

  const processPayoutRequestMutation = useProcessPayoutRequest();

  const handleProcessRequest = async (
    status: "transferred" | "rejected",
    adminNotes?: string,
  ) => {
    if (!selectedRequest) return;

    try {
      await processPayoutRequestMutation.mutateAsync({
        id: selectedRequest.payoutRequest.id,
        data: {
          status,
          adminNotes,
        },
      });

      toast.success(
        status === "transferred"
          ? "Payout marked as transferred successfully!"
          : "Payout request rejected and wallet refunded successfully.",
      );
      setSelectedRequest(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to process payout request.",
      );
    }
  };

  const payoutRequests = Array.isArray(payoutRequestsResponse)
    ? payoutRequestsResponse
    : (payoutRequestsResponse?.data ?? []);
  const payoutTotalPages = Array.isArray(payoutRequestsResponse)
    ? 1
    : (payoutRequestsResponse?.totalPages ?? 1);
  const payoutCurrentPage = Array.isArray(payoutRequestsResponse)
    ? 1
    : (payoutRequestsResponse?.page ?? 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Payments & Withdrawals
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor checkout ledger transactions and process provider withdrawal
          requests.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="payments">Payments Ledger</TabsTrigger>
          <TabsTrigger value="payout-requests">Payout Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="mt-4">
          <PaymentsLedgerTable
            data={paymentsResponse?.data?.data || []}
            total={paymentsResponse?.data?.total || 0}
            currentPage={paymentsResponse?.data?.page || 1}
            totalPages={paymentsResponse?.data?.totalPages || 1}
            isLoading={isLoadingPayments}
            search={paymentParams.search}
            transactionStatus={paymentParams.transactionStatus}
            onSearchChange={(search) =>
              setPaymentParams((prev) => ({ ...prev, search, page: 1 }))
            }
            onStatusChange={(status) =>
              setPaymentParams((prev) => ({
                ...prev,
                transactionStatus: status,
                page: 1,
              }))
            }
            onPageChange={(page) =>
              setPaymentParams((prev) => ({ ...prev, page }))
            }
            onSelectPayment={setSelectedPayment}
          />
        </TabsContent>

        <TabsContent value="payout-requests" className="mt-4">
          <PayoutRequestsTable
            data={payoutRequests}
            currentPage={payoutCurrentPage}
            totalPages={payoutTotalPages}
            isLoading={isLoadingPayoutRequests}
            search={payoutParams.search}
            status={payoutParams.status}
            onSearchChange={(search) =>
              setPayoutParams((prev) => ({ ...prev, search, page: 1 }))
            }
            onStatusChange={(status) =>
              setPayoutParams((prev) => ({ ...prev, status, page: 1 }))
            }
            onPageChange={(page) =>
              setPayoutParams((prev) => ({ ...prev, page }))
            }
            onSelectRequest={setSelectedRequest}
          />
        </TabsContent>
      </Tabs>

      <PaymentDetailsDialog
        payment={selectedPayment}
        open={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />

      <PayoutRequestDialog
        request={selectedRequest}
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onProcess={handleProcessRequest}
        isProcessing={processPayoutRequestMutation.isPending}
      />
    </div>
  );
}
