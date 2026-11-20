import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CancelOperationButton({
  onCancel,
  isCancelling = false,
  cancelLabel = "Cancel",
  cancellingLabel = "Cancelling...",
}: {
  onCancel: () => void;
  isCancelling?: boolean;
  cancelLabel?: string;
  cancellingLabel?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onCancel}
      disabled={isCancelling}
    >
      <X className="mr-1.5 size-3.5" aria-hidden />
      {isCancelling ? cancellingLabel : cancelLabel}
    </Button>
  );
}
