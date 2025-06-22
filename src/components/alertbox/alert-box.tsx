import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { ProgressBar } from "../progress-bar/progress-bar";
import { useEffect } from "react";

export function AlertBox({
  onClose,
  message,
}: {
  onClose: () => void;
  message: string | undefined;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5500);

    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="grid w-full max-w-xs items-start gap-4 text-white">
      <Alert
        variant="destructive"
        className="relative bg-gray-900 text-white shadow-lg border-none overflow-hidden"
      >
        {/* Progress Bar at Top */}
        <div className="absolute top-0 inset-x-0 h-1">
          <ProgressBar />
        </div>

        <AlertCircleIcon />
        <AlertTitle className="mt-2">
          Unable to process your request.
        </AlertTitle>
        <AlertDescription>
          <ul className="list-inside list-disc text-sm">
            <li>{message || "Invalid Message"}</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
