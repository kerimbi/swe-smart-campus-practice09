import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import type { AvailabilityResult } from "@/lib/availability";

const resultStyles: Record<AvailabilityResult["status"], string> = {
  available: "border-emerald-200 bg-emerald-50",
  unavailable: "border-rose-200 bg-rose-50",
  invalid: "border-amber-200 bg-amber-50",
};

const resultIcon: Record<AvailabilityResult["status"], typeof CheckCircle2> = {
  available: CheckCircle2,
  unavailable: XCircle,
  invalid: AlertTriangle,
};

const resultIconColor: Record<AvailabilityResult["status"], string> = {
  available: "text-emerald-600",
  unavailable: "text-rose-600",
  invalid: "text-amber-600",
};

interface ResultMessageProps {
  result: AvailabilityResult;
}

export default function ResultMessage({ result }: ResultMessageProps) {
  const Icon = resultIcon[result.status];

  return (
    <div
      className={`mt-5 flex items-start gap-3 rounded-xl border px-4 py-3.5 animate-slide-in-from-bottom-2 ${resultStyles[result.status]}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${resultIconColor[result.status]}`} />
      <div>
        <p className={`text-sm font-semibold ${resultIconColor[result.status]}`}>
          {result.status === "available"
            ? "Available"
            : result.status === "unavailable"
              ? "Unavailable"
              : "Invalid input"}
        </p>
        <p className="mt-0.5 text-sm text-slate-600">{result.message}</p>
      </div>
    </div>
  );
}
