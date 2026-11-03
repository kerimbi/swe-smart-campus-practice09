import { RotateCcw } from "lucide-react";

interface TimeRequestFormProps {
  startInput: string;
  endInput: string;
  startPreview: string;
  endPreview: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onCheck: () => void;
  onReset: () => void;
}

export default function TimeRequestForm({
  startInput,
  endInput,
  startPreview,
  endPreview,
  onStartChange,
  onEndChange,
  onCheck,
  onReset,
}: TimeRequestFormProps) {
  return (
    <div>
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="start" className="mb-1.5 block text-sm font-medium text-slate-700">
            Start <span className="text-slate-400 font-normal">(minutes)</span>
          </label>
          <input
            id="start"
            type="text"
            inputMode="numeric"
            value={startInput}
            onChange={(e) => onStartChange(e.target.value)}
            placeholder="e.g. 555"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <p className="mt-1 text-xs text-slate-400">
            = <span className="font-mono font-medium text-slate-500">{startPreview}</span>
          </p>
        </div>
        <div>
          <label htmlFor="end" className="mb-1.5 block text-sm font-medium text-slate-700">
            End <span className="text-slate-400 font-normal">(minutes)</span>
          </label>
          <input
            id="end"
            type="text"
            inputMode="numeric"
            value={endInput}
            onChange={(e) => onEndChange(e.target.value)}
            placeholder="e.g. 615"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <p className="mt-1 text-xs text-slate-400">
            = <span className="font-mono font-medium text-slate-500">{endPreview}</span>
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCheck}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Check Availability
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset"
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-slate-600 transition hover:bg-slate-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
