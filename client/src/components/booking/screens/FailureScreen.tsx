import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface Props {
  message: string;
  onRetry: () => void;
  onClose: () => void;
}

export default function FailureScreen({ message, onRetry, onClose }: Props) {
  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <XCircle className="h-8 w-8 text-destructive" />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-medium">Something went wrong</h3>
        <p className="text-sm text-muted-foreground max-w-[260px]">
          {message}
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full mt-2">
        <Button className="w-full" onClick={onRetry}>
          Try again
        </Button>

        <Button variant="ghost" className="w-full" onClick={onClose}>
          Cancel booking
        </Button>
      </div>
    </div>
  );
}