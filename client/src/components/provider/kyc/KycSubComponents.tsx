import { FileText, Upload, X, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export type FileState = { name: string; url: string; file: File; isPdf: boolean };

export const StatusBadge = ({ status }: { status: string }) => {
  switch (status.toLowerCase()) {
    case "verified":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200/50 gap-1 px-2 py-0.5">
          <CheckCircle2 className="h-3 w-3" /> Verified
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary" className="gap-1 px-2 py-0.5 text-muted-foreground bg-secondary/50">
          <Clock className="h-3 w-3" /> Pending Review
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive" className="gap-1 px-2 py-0.5">
          <AlertCircle className="h-3 w-3" /> Rejected
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground bg-secondary/20 border border-border/30 rounded-xl px-3 py-2.5 leading-relaxed">
        {value}
      </p>
    </div>
  );
}

export function DocPreview({ label, url }: { label: string; url: string }) {
  const isPdf = url?.toLowerCase().includes(".pdf");

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {isPdf ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/10 p-4 text-sm font-medium text-primary hover:bg-secondary/20 transition-colors aspect-video"
        >
          <FileText className="h-5 w-5 shrink-0" />
          <span>View PDF Document</span>
        </a>
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="rounded-xl overflow-hidden border border-border/50 aspect-video bg-secondary/10">
            <img
              src={url}
              alt={label}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </a>
      )}
    </div>
  );
}

export function FileUploadSlot({
  label,
  value,
  inputRef,
  onChange,
  onRemove,
}: {
  label: string;
  value: FileState | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <input
        type="file"
        ref={inputRef}
        accept="image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={onChange}
      />
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-border/50 aspect-video bg-secondary/10 flex items-center justify-center p-4">
          {value.isPdf ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-xs font-medium truncate max-w-[150px]">
                {value.name}
              </span>
            </div>
          ) : (
            <img
              src={value.url}
              alt={label}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full h-6 w-6 flex items-center justify-center hover:bg-destructive/90 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="rounded-xl border border-dashed border-border/50 bg-secondary/10 p-8 flex flex-col items-center gap-2 cursor-pointer hover:bg-secondary/20 transition-colors aspect-video justify-center"
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground font-medium">Click to upload</p>
          <p className="text-xs text-muted-foreground/60">JPG, PNG or PDF</p>
        </div>
      )}
    </div>
  );
}