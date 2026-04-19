import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { ShieldCheck, Pencil, Loader2, AlertCircle } from "lucide-react"; // Added AlertCircle

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useSubmitKycIdentity } from "@/hooks/provider/useSubmitKycIdentity";
import { useUploadKycDocument } from "@/hooks/provider/useUploadKycDocument";
import { useUploadKycToS3Mutation } from "@/hooks/provider/useUploadKycToS3Mutation";
import { kycIdentitySchema, type KycIdentityFormValues } from "@/utils/validations/provider/kyc.schema";
import type { ProviderKycDocument } from "@/interfaces/provider/kyc.interface";

import { 
  FileUploadSlot, 
  StatusBadge, 
  InfoRow, 
  DocPreview, 
  type FileState 
} from "./KycSubComponents";

export function KycIdentityForm({ existingData }: { existingData: ProviderKycDocument | undefined }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [aadhaarFront, setAadhaarFront] = useState<FileState | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<FileState | null>(null);
  
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: submitKycIdentity, isPending: isSubmittingKyc } = useSubmitKycIdentity();
  const { mutateAsync: getUploadUrl } = useUploadKycDocument();
  const { mutateAsync: uploadToS3 } = useUploadKycToS3Mutation();

  const kycForm = useForm<KycIdentityFormValues>({
    resolver: zodResolver(kycIdentitySchema),
    defaultValues: {
      fullName: existingData?.fullName ?? "",
      aadhaarNumber: existingData?.aadhaarNumber ?? "",
      dateOfBirth: existingData?.dateOfBirth ? format(new Date(existingData.dateOfBirth), "yyyy-MM-dd") : "",
      address: existingData?.address ?? "",
    },
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: FileState | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      toast.error("File type not supported.");
      return;
    }
    const isPdf = file.type === "application/pdf";
    setter({ name: file.name, url: isPdf ? "" : URL.createObjectURL(file), file, isPdf });
    e.target.value = "";
  };

  const uploadFileToS3 = async (file: File): Promise<string> => {
    const response = await getUploadUrl({ fileType: file.type });
    if (!response.data) throw new Error("Could not get upload URL");
    await uploadToS3({ uploadUrl: response.data.uploadUrl, file });
    return response.data.fileUrl;
  };

  const onKycSubmit = async (values: KycIdentityFormValues) => {
    if (!aadhaarFront || !aadhaarBack) {
      toast.error("Please upload both front and back of your Aadhaar");
      return;
    }

    setIsUploading(true);
    try {
      const [frontUrl, backUrl] = await Promise.all([
        uploadFileToS3(aadhaarFront.file),
        uploadFileToS3(aadhaarBack.file),
      ]);

      await submitKycIdentity({ 
        ...values, 
        aadhaarFrontUrl: frontUrl, 
        aadhaarBackUrl: backUrl 
      });
      
      toast.success("KYC details submitted for verification!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit KYC");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setAadhaarFront(null);
    setAadhaarBack(null);
    kycForm.reset();
  };

  const isLoading = isUploading || isSubmittingKyc;
  const showReadOnly = !!existingData && !isEditing;

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-card-foreground text-base flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Aadhaar Verification
          </CardTitle>
          <div className="flex items-center gap-2">
            {existingData && <StatusBadge status={existingData.status} />}
            {existingData && !isEditing && existingData.status !== "verified" && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 gap-1.5 text-xs hover:bg-secondary/50" 
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3 w-3" /> Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {showReadOnly ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {existingData.reason && !isEditing && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-destructive">Verification Issue</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {existingData.reason}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <InfoRow label="Full Name (as on Aadhaar)" value={existingData.fullName} />
              <InfoRow label="Aadhaar Number" value={existingData.aadhaarNumber} />
              <InfoRow 
                label="Date of Birth" 
                value={existingData.dateOfBirth ? format(new Date(existingData.dateOfBirth), "yyyy-MM-dd") : ""} 
              />
              <InfoRow label="Address" value={existingData.address} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DocPreview label="Aadhaar Front" url={existingData.aadhaarFrontUrl} />
              <DocPreview label="Aadhaar Back" url={existingData.aadhaarBackUrl} />
            </div>
          </div>
        ) : (
          <form onSubmit={kycForm.handleSubmit(onKycSubmit)} className="space-y-6">
            {/* Form Fields remain exactly as they were */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Full Name</Label>
                <Input {...kycForm.register("fullName")} placeholder="Enter full name" className="bg-secondary/30 border-border/50 rounded-xl" />
                {kycForm.formState.errors.fullName && <p className="text-xs text-destructive">{kycForm.formState.errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Aadhaar Number</Label>
                <Input {...kycForm.register("aadhaarNumber")} maxLength={12} placeholder="XXXX XXXX XXXX" className="bg-secondary/30 border-border/50 rounded-xl" />
                {kycForm.formState.errors.aadhaarNumber && <p className="text-xs text-destructive">{kycForm.formState.errors.aadhaarNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Date of Birth</Label>
                <Input {...kycForm.register("dateOfBirth")} type="date" className="bg-secondary/30 border-border/50 rounded-xl" />
                {kycForm.formState.errors.dateOfBirth && <p className="text-xs text-destructive">{kycForm.formState.errors.dateOfBirth.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Address</Label>
                <Input {...kycForm.register("address")} placeholder="Enter address" className="bg-secondary/30 border-border/50 rounded-xl" />
                {kycForm.formState.errors.address && <p className="text-xs text-destructive">{kycForm.formState.errors.address.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileUploadSlot label="Aadhaar Front" value={aadhaarFront} inputRef={frontRef} onChange={(e) => handleFile(e, setAadhaarFront)} onRemove={() => setAadhaarFront(null)} />
              <FileUploadSlot label="Aadhaar Back" value={aadhaarBack} inputRef={backRef} onChange={(e) => handleFile(e, setAadhaarBack)} onRemove={() => setAadhaarBack(null)} />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={isLoading} className="rounded-xl shadow-lg shadow-primary/20 px-8">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit for Verification"
                )}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" className="rounded-xl" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}