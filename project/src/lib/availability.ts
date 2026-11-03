import { MINUTES_PER_DAY } from "@/lib/constants";

export type AvailabilityStatus = "available" | "unavailable" | "invalid";

export interface AvailabilityResult {
  status: AvailabilityStatus;
  message: string;
}

export interface AvailabilityConfig {
  now: number;
  roomName: string;
  blocked: boolean;
  bookings: [number, number][];
}

interface TimeRange {
  start: number;
  end: number;
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const INTEGER_RE = /^-?\d+$/;
const MAX_DURATION_MINUTES = 120;

export function isWithinDay(minutes: number): boolean {
  return minutes >= 0 && minutes <= MINUTES_PER_DAY;
}

function createResult(status: AvailabilityStatus, message: string): AvailabilityResult {
  return { status, message };
}

function parseInput(startInput: string, endInput: string): TimeRange | AvailabilityResult {
  const startTrim = startInput.trim();
  const endTrim = endInput.trim();

  if (startTrim === "" || endTrim === "") {
    return createResult("invalid", "Please enter both start and end times.");
  }

  if (!INTEGER_RE.test(startTrim) || !INTEGER_RE.test(endTrim)) {
    return createResult(
      "invalid",
      "Start and end must be whole numbers (minutes after midnight)."
    );
  }

  return { start: parseInt(startTrim, 10), end: parseInt(endTrim, 10) };
}

function checkRange(
  { start, end }: TimeRange,
  now: number
): AvailabilityResult | null {
  if (start >= end) {
    return createResult("invalid", "Start time must be earlier than end time.");
  }

  if (!isWithinDay(start) || !isWithinDay(end)) {
    return createResult(
      "invalid",
      `Times must be between 0 and ${MINUTES_PER_DAY} minutes (00:00–24:00).`
    );
  }

  if (start <= now) {
    return createResult(
      "invalid",
      `Start time must be after the current time (${formatTime(now)}).`
    );
  }

  return null;
}

function checkDuration({ start, end }: TimeRange): AvailabilityResult | null {
  if (end - start > MAX_DURATION_MINUTES) {
    return createResult(
      "invalid",
      `Duration must not exceed ${MAX_DURATION_MINUTES} minutes.`
    );
  }

  return null;
}

function checkBlocked(blocked: boolean, roomName: string): AvailabilityResult | null {
  if (blocked) {
    return createResult("unavailable", `${roomName} is blocked and unavailable.`);
  }

  return null;
}

function checkOverlap(
  { start, end }: TimeRange,
  bookings: [number, number][]
): AvailabilityResult | null {
  for (const [bStart, bEnd] of bookings) {
    if (start < bEnd && bStart < end) {
      return createResult(
        "unavailable",
        `Overlaps existing booking ${formatTime(bStart)}–${formatTime(bEnd)}.`
      );
    }
  }

  return null;
}

export function checkAvailability(
  startInput: string,
  endInput: string,
  config: AvailabilityConfig
): AvailabilityResult {
  const { now, roomName, blocked, bookings } = config;

  const parsed = parseInput(startInput, endInput);
  if ("status" in parsed) return parsed;

  const rangeResult = checkRange(parsed, now);
  if (rangeResult) return rangeResult;

  const durationResult = checkDuration(parsed);
  if (durationResult) return durationResult;

  const blockedResult = checkBlocked(blocked, roomName);
  if (blockedResult) return blockedResult;

  const overlapResult = checkOverlap(parsed, bookings);
  if (overlapResult) return overlapResult;

  return createResult("available", `${roomName} is available for the requested time.`);
}
