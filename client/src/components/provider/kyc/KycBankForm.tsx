import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CreditCard, Loader2, Pencil } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useSaveKycBank } from "@/hooks/provider/useSaveKycBank";
import { useUploadKycDocument } from "@/hooks/provider/useUploadKycDocument";
import { useUploadKycToS3Mutation } from "@/hooks/provider/useUploadKycToS3Mutation";
import {
  kycBankSchema,
  type KycBankFormValues,
} from "@/utils/validations/provider/kyc.schema";

import {
  FileUploadSlot,
  StatusBadge,
  InfoRow,
  DocPreview,
  type FileState,
} from "./KycSubComponents";
import type { providerBankDocument } from "@/interfaces/provider/kyc.interface";
import axios from "axios";

export function KycBankForm({
  existingData,
}: {
  existingData: providerBankDocument | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [passbookFile, setPassbookFile] = useState<FileState | null>(null);
  const passbookRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: saveKycBank, isPending: isSavingBank } =
    useSaveKycBank();
  const { mutateAsync: getUploadUrl } = useUploadKycDocument();
  const { mutateAsync: uploadToS3 } = useUploadKycToS3Mutation();

  const bankForm = useForm<KycBankFormValues>({
    resolver: zodResolver(kycBankSchema),
    defaultValues: {
      accountHolderName: existingData?.accountHolderName ?? "",
      bankName: existingData?.bankName ?? "",
      accountNumber: existingData?.accountNumber ?? "",
      confirmAccountNumber: existingData?.accountNumber ?? "",
      ifscCode: existingData?.ifscCode ?? "",
      branchName: existingData?.branchName ?? "",
    },
  });

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: FileState | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      toast.error("File type not supported.");
      return;
    }
    const isPdf = file.type === "application/pdf";
    setter({
      name: file.name,
      url: isPdf ? "" : URL.createObjectURL(file),
      file,
      isPdf,
    });
    e.target.value = "";
  };

  const uploadFileToS3 = async (file: File): Promise<string> => {
    const response = await getUploadUrl({ fileType: file.type });
    if (!response.data) throw new Error("Could not get upload URL");

    await uploadToS3({ uploadUrl: response.data.uploadUrl, file });
    return response.data.fileUrl;
  };

  const onBankSubmit = async (values: KycBankFormValues) => {
    if (!passbookFile && !existingData?.passbookUrl) {
      toast.error("Please upload passbook or cancelled cheque");
      return;
    }

    setIsUploading(true);
    try {
      let fileUrl: string;

      if (passbookFile) {
        fileUrl = await uploadFileToS3(passbookFile.file);
      } else if (existingData?.passbookUrl) {
        fileUrl = existingData.passbookUrl;
      } else {
        throw new Error("Passbook URL missing");
      }

      await saveKycBank({
        accountHolderName: values.accountHolderName,
        bankName: values.bankName,
        accountNumber: values.accountNumber,
        ifscCode: values.ifscCode,
        branchName: values.branchName,
        passbookUrl: fileUrl,
      });

      toast.success("Bank details saved successfully!");
      setIsEditing(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Server error occurred");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPassbookFile(null);
    bankForm.reset();
  };

  const isLoading = isUploading || isSavingBank;
  const showReadOnly = !!existingData && !isEditing;

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-card-foreground text-base flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" /> Bank Account Details
          </CardTitle>
          <div className="flex items-center gap-2">
            {existingData && <StatusBadge status={existingData.status} />}
            {existingData &&
              !isEditing &&
              existingData.status !== "verified" && (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <InfoRow
                label="Account Holder Name"
                value={existingData.accountHolderName}
              />
              <InfoRow label="Bank Name" value={existingData.bankName} />
              <InfoRow
                label="Account Number"
                value={existingData.accountNumber}
              />
              <InfoRow label="IFSC Code" value={existingData.ifscCode} />
              <InfoRow label="Branch Name" value={existingData.branchName} />
            </div>
            <div className="max-w-sm pt-2">
              <DocPreview
                label="Passbook / Cancelled Cheque"
                url={existingData.passbookUrl}
              />
            </div>
          </div>
        ) : (
          <form
            onSubmit={bankForm.handleSubmit(onBankSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Account Holder Name
                </Label>
                <Input
                  {...bankForm.register("accountHolderName")}
                  placeholder="Enter account holder name"
                  className="bg-secondary/30 border-border/50 rounded-xl"
                />
                {bankForm.formState.errors.accountHolderName && (
                  <p className="text-xs text-destructive">
                    {bankForm.formState.errors.accountHolderName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Bank Name
                </Label>
                <Input
                  {...bankForm.register("bankName")}
                  placeholder="Enter bank name"
                  className="bg-secondary/30 border-border/50 rounded-xl"
                />
                {bankForm.formState.errors.bankName && (
                  <p className="text-xs text-destructive">
                    {bankForm.formState.errors.bankName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Account Number
                </Label>
                <Input
                  {...bankForm.register("accountNumber")}
                  placeholder="Enter account number"
                  className="bg-secondary/30 border-border/50 rounded-xl"
                />
                {bankForm.formState.errors.accountNumber && (
                  <p className="text-xs text-destructive">
                    {bankForm.formState.errors.accountNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Confirm Account Number
                </Label>
                <Input
                  {...bankForm.register("confirmAccountNumber")}
                  placeholder="Re-enter account number"
                  className="bg-secondary/30 border-border/50 rounded-xl"
                />
                {bankForm.formState.errors.confirmAccountNumber && (
                  <p className="text-xs text-destructive">
                    {bankForm.formState.errors.confirmAccountNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  IFSC Code
                </Label>
                <Input
                  {...bankForm.register("ifscCode")}
                  placeholder="Enter IFSC code"
                  className="bg-secondary/30 border-border/50 rounded-xl"
                />
                {bankForm.formState.errors.ifscCode && (
                  <p className="text-xs text-destructive">
                    {bankForm.formState.errors.ifscCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Branch Name
                </Label>
                <Input
                  {...bankForm.register("branchName")}
                  placeholder="Enter branch name"
                  className="bg-secondary/30 border-border/50 rounded-xl"
                />
                {bankForm.formState.errors.branchName && (
                  <p className="text-xs text-destructive">
                    {bankForm.formState.errors.branchName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="max-w-sm">
              <FileUploadSlot
                label="Passbook / Cancelled Cheque"
                value={passbookFile}
                inputRef={passbookRef}
                onChange={(e) => handleFile(e, setPassbookFile)}
                onRemove={() => setPassbookFile(null)}
              />
              {/* Optional helper text to let them know they don't have to re-upload if editing */}
              {existingData?.passbookUrl && !passbookFile && (
                <p className="text-xs text-muted-foreground mt-2">
                  * Leave blank to keep your previously uploaded passbook.
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl shadow-lg shadow-primary/20 px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Bank Details"
                )}
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={handleCancelEdit}
                >
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
