import { CalendarDays } from "lucide-react";
import { formatTime } from "@/lib/availability";

interface BookingsListProps {
  roomName: string;
  bookings: [number, number][];
}

export default function BookingsList({ roomName, bookings }: BookingsListProps) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-600">Existing Bookings</span>
        <span className="text-xs text-slate-400">(read-only)</span>
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm text-slate-400">No bookings for {roomName}.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {bookings.map(([bStart, bEnd]) => (
            <span
              key={`${bStart}-${bEnd}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              {formatTime(bStart)} – {formatTime(bEnd)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
