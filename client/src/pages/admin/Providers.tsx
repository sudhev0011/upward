import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Briefcase,
  FileText,
  ExternalLink,
  ArrowUpDown,
  X,
} from "lucide-react";

import { DataTable } from "@/components/admin/DataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useGetProviderProfiles } from "@/hooks/admin/useGetProviderProfiles";
import { useGetProviderProfileById } from "@/hooks/admin/useGetProviderProfileById";
import { useGetProviderKyc } from "@/hooks/admin/useGetProviderKyc";
import { useBlockProviderMutation } from "@/hooks/admin/useBlockProvider";
import { useApproveProviderMutation } from "@/hooks/admin/useApproveProvider";
import { useRejectProviderMutation } from "@/hooks/admin/useRejectProvider";
import { format } from "date-fns";

export default function Providers() {
  // ─── STATE ──────────────────────────────────────────────────────────────────
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    isBlocked: undefined as boolean | undefined,
    isApprovedByAdmin: undefined as boolean | undefined,
  });

  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    null,
  );
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // ─── DATA FETCHING ──────────────────────────────────────────────────────────

  // 1. List View
  const { data: listData } = useGetProviderProfiles(params);

  // 2. Profile Details
  const { data: profileDetails, isLoading: isProfileLoading } =
    useGetProviderProfileById(selectedProviderId);

  // 3. KYC Documents
  const { data: kycData, isLoading: isKycLoading } =
    useGetProviderKyc(selectedProviderId);

  // ─── HANDLERS ───────────────────────────────────────────────────────────────

  const closeDialog = () => {
    setSelectedProviderId(null);
    setIsRejecting(false);
    setRejectionReason("");
  };

  // ─── MUTATIONS ──────────────────────────────────────────────────────────────
  const blockMutation = useBlockProviderMutation();

  const approveMutation = useApproveProviderMutation(closeDialog);

  const rejectMutation = useRejectProviderMutation(closeDialog);

  // ─── COLUMN DEFINITIONS ─────────────────────────────────────────────────────
  const columns = [
    {
      header: "Provider",
      cell: (p: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <img src={p.avatarUrl} alt="" className="object-cover" />
            <AvatarFallback className="bg-primary/5 text-primary text-xs">
              {p.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm leading-none mb-1">{p.name}</p>
            <p className="text-xs text-muted-foreground">{p.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (p: any) => (
        <Badge
          variant={p.isApprovedByAdmin ? "default" : "secondary"}
          className="text-[10px]"
        >
          {p.isApprovedByAdmin ? "Approved" : "Pending"}
        </Badge>
      ),
    },
    {
      header: "Account",
      cell: (p: any) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={p.isBlocked}
            onCheckedChange={(checked) =>
              blockMutation.mutate({ userId: p.userId, isBlocked: checked })
            }
            onClick={(e) => e.stopPropagation()}
          />
          <span className="text-xs text-muted-foreground">
            {p.isBlocked ? "Blocked" : "Active"}
          </span>
        </div>
      ),
    },
    {
      header: "Joined",
      cell: (p: any) => (
        <span className="text-sm text-muted-foreground">
          {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Provider Management
        </h1>
      </div>

      <DataTable
        columns={columns}
        data={listData?.data?.providers || []}
        rowKey={(p) => p.userId}
        onRowClick={(p) => setSelectedProviderId(p.userId)}
        search={params.search}
        onSearchChange={(val) =>
          setParams((prev) => ({ ...prev, search: val, page: 1 }))
        }
        currentPage={listData?.data?.page || 1}
        totalPages={listData?.data?.totalPages || 1}
        onPageChange={(newPage) =>
          setParams((prev) => ({ ...prev, page: newPage }))
        }
        filters={
          <div className="flex gap-2">
            <Select
              value={params.sortBy}
              onValueChange={(val) =>
                setParams((prev) => ({ ...prev, sortBy: val }))
              }
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Joined</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={
                params.isBlocked === undefined
                  ? "all"
                  : String(params.isBlocked)
              }
              onValueChange={(val) =>
                setParams((p) => ({
                  ...p,
                  isBlocked: val === "all" ? undefined : val === "true",
                }))
              }
            >
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="false">Active Only</SelectItem>
                <SelectItem value="true">Blocked Only</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() =>
                setParams((p) => ({
                  ...p,
                  sortOrder: p.sortOrder === "asc" ? "desc" : "asc",
                }))
              }
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      {/* ─── DETAILS DIALOG ─── */}
      <Dialog open={!!selectedProviderId} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-3xl h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2 relative">
            <DialogTitle className="text-xl">
              Review Provider Application
            </DialogTitle>
            <DialogDescription>
              Verify professional details and identity documents
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-8">
            {isProfileLoading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <p className="text-sm italic">Retrieving profile...</p>
              </div>
            ) : (
              <>
                {/* Profile Header Card */}
                <div className="flex items-start gap-6 bg-muted/30 p-5 rounded-2xl border border-border/50">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                    <img
                      src={profileDetails?.data?.avatarUrl ?? undefined}
                      alt=""
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl">
                      {profileDetails?.data?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-bold truncate">
                        {profileDetails?.data?.name}
                      </h3>
                      {profileDetails?.data?.isVerified && (
                        <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-none">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed italic mb-4">
                      "
                      {profileDetails?.data?.bio ||
                        "No professional bio provided."}
                      "
                    </p>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4 text-primary/70" />{" "}
                        {profileDetails?.data?.email}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4 text-primary/70" />{" "}
                        {profileDetails?.data?.phone}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary/70" />{" "}
                        {profileDetails?.data?.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-4 w-4 text-primary/70" />{" "}
                        {profileDetails?.data?.experience} Years Exp.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills & Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2 uppercase tracking-tight text-muted-foreground">
                      Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profileDetails?.data?.skills?.map((skill: string) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="font-normal capitalize"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2 uppercase tracking-tight text-muted-foreground">
                      Additional Info
                    </h4>
                    <div className="space-y-1.5 text-sm">
                      <p>
                        <span className="text-muted-foreground">
                          Languages:
                        </span>{" "}
                        {profileDetails?.data?.languages?.join(", ")}
                      </p>
                      <p>
                        <span className="text-muted-foreground">DOB:</span>{" "}
                        {profileDetails?.data?.dateOfBirth
                          ? new Date(
                              profileDetails.data.dateOfBirth,
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* KYC Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-primary" /> Identity
                      Documents (Aadhaar)
                    </h4>
                  </div>

                  {isKycLoading ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 bg-muted animate-pulse rounded-xl" />
                      <div className="h-32 bg-muted animate-pulse rounded-xl" />
                    </div>
                  ) : kycData?.data ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground px-1">
                            FRONT VIEW
                          </Label>
                          <div className="group relative border rounded-xl overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
                            <img
                              src={kycData.data.aadhaarFrontUrl}
                              className="object-contain w-full h-full p-2"
                              alt="Front"
                            />
                            <a
                              href={kycData.data.aadhaarFrontUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground px-1">
                            BACK VIEW
                          </Label>
                          <div className="group relative border rounded-xl overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
                            <img
                              src={kycData.data.aadhaarBackUrl}
                              className="object-contain w-full h-full p-2"
                              alt="Back"
                            />
                            <a
                              href={kycData.data.aadhaarBackUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">
                            Name on ID
                          </p>
                          <p className="font-semibold text-sm">
                            {kycData.data.fullName}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">
                            ID Number
                          </p>
                          <p className="font-mono text-sm tracking-widest">
                            {kycData.data.aadhaarNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">
                            Date of Birth
                          </p>
                          <p className="font-mono text-sm tracking-widest">
                            {format(new Date(kycData.data.dateOfBirth), "dd-MM-yyyy")}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">
                            address
                          </p>
                          <p className="font-mono text-sm tracking-widest">
                            {kycData.data.address}
                          </p>
                        </div>
                      </div>

                      {/* Approval/Rejection Logic */}
                      {!profileDetails?.data?.isApprovedByAdmin && (
                        <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
                          {!isRejecting ? (
                            <div className="flex gap-4">
                              <Button
                                className="flex-1 h-12 bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20"
                                onClick={() =>
                                  approveMutation.mutate({
                                    userId: selectedProviderId!,
                                    isApprovedByAdmin: true,
                                  })
                                }
                                disabled={approveMutation.isPending}
                              >
                                {approveMutation.isPending
                                  ? "Processing..."
                                  : "Approve Professional"}
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 h-12 border-destructive text-destructive hover:bg-destructive/5"
                                onClick={() => setIsRejecting(true)}
                              >
                                Reject Application
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                              <div className="flex items-center justify-between">
                                <Label className="text-destructive font-bold text-sm">
                                  Reason for Rejection
                                </Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => setIsRejecting(false)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <Textarea
                                placeholder="Explain why the documents or profile were rejected..."
                                value={rejectionReason}
                                onChange={(e) =>
                                  setRejectionReason(e.target.value)
                                }
                                className="min-h-[100px] border-destructive/30 focus-visible:ring-destructive"
                              />
                              <Button
                                variant="destructive"
                                className="w-full h-11"
                                disabled={
                                  !rejectionReason || rejectMutation.isPending
                                }
                                onClick={() =>
                                  rejectMutation.mutate({
                                    userId: selectedProviderId!,
                                    isApprovedByAdmin: false,
                                    reason: rejectionReason,
                                  })
                                }
                              >
                                {rejectMutation.isPending
                                  ? "Sending..."
                                  : "Confirm & Send Rejection"}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 border-2 border-dashed rounded-2xl">
                      <p className="text-muted-foreground text-sm">
                        The provider hasn't uploaded verification documents yet.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
