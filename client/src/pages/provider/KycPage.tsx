import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/provider/dashboard/StatusBadge";
import { ShieldCheck, Upload, Building2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";

export default function KycPage() {
  const [aadhaarFront, setAadhaarFront] = useState<{ name: string; url: string } | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<{ name: string; url: string } | null>(null);
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const [passbookFile, setPassbookFile] = useState<{ name: string; url: string } | null>(null);
  const passbookRef = useRef<HTMLInputElement>(null);

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: { name: string; url: string } | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setter({ name: file.name, url: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">KYC & Bank Details</h1>
        <p className="text-muted-foreground mt-1.5">Verify your identity and set up payment information.</p>
      </div>

      <Tabs defaultValue="kyc" className="w-full">
        <TabsList className="w-full sm:w-auto bg-secondary/50 rounded-xl p-1">
          <TabsTrigger value="kyc" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
            <ShieldCheck className="h-4 w-4 mr-2" /> KYC Verification
          </TabsTrigger>
          <TabsTrigger value="bank" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6">
            <Building2 className="h-4 w-4 mr-2" /> Bank Details
          </TabsTrigger>
        </TabsList>

        {/* KYC Tab */}
        <TabsContent value="kyc" className="space-y-6 mt-6">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-card-foreground text-base flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Aadhaar Verification
                </CardTitle>
                <StatusBadge status="pending" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Aadhaar Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name (as on Aadhaar)</Label>
                  <Input placeholder="Enter full name" className="bg-secondary/30 border-border/50 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aadhaar Number</Label>
                  <Input placeholder="XXXX XXXX XXXX" maxLength={14} className="bg-secondary/30 border-border/50 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date of Birth</Label>
                  <Input type="date" className="bg-secondary/30 border-border/50 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Address</Label>
                  <Input placeholder="Enter address" className="bg-secondary/30 border-border/50 rounded-xl" />
                </div>
              </div>

              {/* Aadhaar Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Front */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aadhaar Front</Label>
                  <input type="file" ref={frontRef} accept="image/*" className="hidden" onChange={(e) => handleFile(e, setAadhaarFront)} />
                  {aadhaarFront ? (
                    <div className="relative rounded-xl overflow-hidden border border-border/50 aspect-video">
                      <img src={aadhaarFront.url} alt="Aadhaar Front" className="w-full h-full object-cover" />
                      <button onClick={() => setAadhaarFront(null)} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs">✕</button>
                    </div>
                  ) : (
                    <div
                      onClick={() => frontRef.current?.click()}
                      className="rounded-xl border border-dashed border-border/50 bg-secondary/10 p-8 flex flex-col items-center gap-2 cursor-pointer hover:bg-secondary/20 transition-colors"
                    >
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upload front side</p>
                    </div>
                  )}
                </div>

                {/* Back */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aadhaar Back</Label>
                  <input type="file" ref={backRef} accept="image/*" className="hidden" onChange={(e) => handleFile(e, setAadhaarBack)} />
                  {aadhaarBack ? (
                    <div className="relative rounded-xl overflow-hidden border border-border/50 aspect-video">
                      <img src={aadhaarBack.url} alt="Aadhaar Back" className="w-full h-full object-cover" />
                      <button onClick={() => setAadhaarBack(null)} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs">✕</button>
                    </div>
                  ) : (
                    <div
                      onClick={() => backRef.current?.click()}
                      className="rounded-xl border border-dashed border-border/50 bg-secondary/10 p-8 flex flex-col items-center gap-2 cursor-pointer hover:bg-secondary/20 transition-colors"
                    >
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upload back side</p>
                    </div>
                  )}
                </div>
              </div>

              <Button className="rounded-xl shadow-lg shadow-primary/20" onClick={() => toast.success("KYC details submitted for verification!")}>
                Submit for Verification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Details Tab */}
        <TabsContent value="bank" className="space-y-6 mt-6">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-card-foreground text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Bank Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Holder Name</Label>
                  <Input placeholder="Enter account holder name" className="bg-secondary/30 border-border/50 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bank Name</Label>
                  <Input placeholder="Enter bank name" className="bg-secondary/30 border-border/50 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Number</Label>
                  <Input placeholder="Enter account number" className="bg-secondary/30 border-border/50 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirm Account Number</Label>
                  <Input placeholder="Re-enter account number" className="bg-secondary/30 border-border/50 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">IFSC Code</Label>
                  <Input placeholder="Enter IFSC code" className="bg-secondary/30 border-border/50 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Branch Name</Label>
                  <Input placeholder="Enter branch name" className="bg-secondary/30 border-border/50 rounded-xl" />
                </div>
              </div>

              {/* Passbook Upload */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Passbook / Cancelled Cheque</Label>
                <input type="file" ref={passbookRef} accept="image/*,.pdf" className="hidden" onChange={(e) => handleFile(e, setPassbookFile)} />
                {passbookFile ? (
                  <div className="relative rounded-xl overflow-hidden border border-border/50 max-w-sm aspect-video">
                    <img src={passbookFile.url} alt="Passbook" className="w-full h-full object-cover" />
                    <button onClick={() => setPassbookFile(null)} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs">✕</button>
                  </div>
                ) : (
                  <div
                    onClick={() => passbookRef.current?.click()}
                    className="rounded-xl border border-dashed border-border/50 bg-secondary/10 p-8 flex flex-col items-center gap-2 cursor-pointer hover:bg-secondary/20 transition-colors max-w-sm"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload passbook or cancelled cheque</p>
                  </div>
                )}
              </div>

              <Button className="rounded-xl shadow-lg shadow-primary/20" onClick={() => toast.success("Bank details saved!")}>
                Save Bank Details
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
