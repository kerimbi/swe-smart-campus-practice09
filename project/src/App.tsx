import { useState } from "react";
import { Clock, DoorClosed } from "lucide-react";
import { checkAvailability, formatTime, isWithinDay, type AvailabilityResult } from "@/lib/availability";
import { BOOKINGS, FIXED_NOW, ROOM_NAME } from "@/lib/constants";
import BookingsList from "@/components/BookingsList";
import ResultMessage from "@/components/ResultMessage";
import TimeRequestForm from "@/components/TimeRequestForm";

export default function App() {
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const clearResult = () => setResult(null);

  const handleCheck = () => {
    setResult(
      checkAvailability(startInput, endInput, {
        now: FIXED_NOW,
        roomName: ROOM_NAME,
        blocked,
        bookings: BOOKINGS,
      })
    );
  };

  const handleReset = () => {
    setStartInput("");
    setEndInput("");
    setBlocked(false);
    setResult(null);
  };

  const startMin = parseInt(startInput, 10);
  const endMin = parseInt(endInput, 10);
  const startPreview = !isNaN(startMin) && isWithinDay(startMin) ? formatTime(startMin) : "—";
  const endPreview = !isNaN(endMin) && isWithinDay(endMin) ? formatTime(endMin) : "—";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
            <DoorClosed className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Room Availability
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Smart Campus Room Availability Checker
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-7">
          {/* Current Time */}
          <div className="mb-6 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Clock className="h-4 w-4 text-blue-600" />
              Current Time
            </div>
            <span className="font-mono text-lg font-semibold text-slate-900">
              {formatTime(FIXED_NOW)}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2.5 text-sm font-medium text-slate-600">{ROOM_NAME}</div>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300">
                <input
                  type="checkbox"
                  checked={blocked}
                  onChange={(e) => {
                    setBlocked(e.target.checked);
                    clearResult();
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Room is blocked
              </label>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <BookingsList roomName={ROOM_NAME} bookings={BOOKINGS} />
            </div>

            <div className="border-t border-slate-100 pt-6">
              <TimeRequestForm
                startInput={startInput}
                endInput={endInput}
                startPreview={startPreview}
                endPreview={endPreview}
                onStartChange={(value) => {
                  setStartInput(value);
                  clearResult();
                }}
                onEndChange={(value) => {
                  setEndInput(value);
                  clearResult();
                }}
                onCheck={handleCheck}
                onReset={handleReset}
              />

              {result && <ResultMessage result={result} />}
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-4 text-center text-xs text-slate-400">
          Times are in minutes after midnight (0–1440). Max duration: 120 minutes.
        </p>
      </div>
    </div>
  );
}
