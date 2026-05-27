import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
}

export default function SuccessScreen({ onClose }: Props) {
  const navigate = useNavigate();

  const handleViewBookings = () => {
    onClose();
    navigate("/client/dashboard/bookings");
  };

  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
        <CheckCircle2 className="h-8 w-8 text-green-500" />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-medium">Booking confirmed!</h3>
        <p className="text-sm text-muted-foreground max-w-[260px]">
          Your booking has been successfully placed. You will receive a
          confirmation shortly.
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full mt-2">
        <Button className="w-full" onClick={handleViewBookings}>
          View my bookings
        </Button>

        <Button variant="ghost" className="w-full" onClick={onClose}>
          Back to browsing
        </Button>
      </div>
    </div>
  );
}