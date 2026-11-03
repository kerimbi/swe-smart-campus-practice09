import { describe, expect, it } from "vitest";
import { checkAvailability, type AvailabilityConfig } from "@/lib/availability";
import { BOOKINGS, FIXED_NOW, ROOM_NAME } from "@/lib/constants";

function config(overrides: Partial<AvailabilityConfig> = {}): AvailabilityConfig {
  return {
    now: FIXED_NOW,
    roomName: ROOM_NAME,
    blocked: false,
    bookings: BOOKINGS.map(([s, e]) => [s, e] as [number, number]),
    ...overrides,
  };
}

describe("checkAvailability input validation", () => {
  it("rejects empty start or end as invalid", () => {
    expect(checkAvailability("", "720", config())).toEqual({
      status: "invalid",
      message: "Please enter both start and end times.",
    });
    expect(checkAvailability("720", "   ", config())).toEqual({
      status: "invalid",
      message: "Please enter both start and end times.",
    });
  });

  it("rejects non-numeric input as invalid", () => {
    expect(checkAvailability("abc", "720", config())).toEqual({
      status: "invalid",
      message: "Start and end must be whole numbers (minutes after midnight).",
    });
    expect(checkAvailability("720", "10:30", config())).toEqual({
      status: "invalid",
      message: "Start and end must be whole numbers (minutes after midnight).",
    });
  });

  it("rejects a start time later than the end time as invalid", () => {
    expect(checkAvailability("780", "720", config())).toEqual({
      status: "invalid",
      message: "Start time must be earlier than end time.",
    });
  });

  it("rejects a start time equal to the end time as invalid", () => {
    expect(checkAvailability("720", "720", config())).toEqual({
      status: "invalid",
      message: "Start time must be earlier than end time.",
    });
  });

  it("rejects a start time at or before the current time as invalid", () => {
    expect(checkAvailability("540", "600", config())).toEqual({
      status: "invalid",
      message: "Start time must be after the current time (09:00).",
    });
    expect(checkAvailability("500", "600", config())).toEqual({
      status: "invalid",
      message: "Start time must be after the current time (09:00).",
    });
  });
});

describe("checkAvailability duration limit", () => {
  it("accepts a 120 minute booking", () => {
    expect(checkAvailability("720", "840", config()).status).toBe("available");
  });

  it("rejects a 121 minute booking as invalid", () => {
    expect(checkAvailability("720", "841", config())).toEqual({
      status: "invalid",
      message: "Duration must not exceed 120 minutes.",
    });
  });
});

describe("checkAvailability blocked rooms", () => {
  it("returns unavailable for a blocked room even with valid times", () => {
    expect(checkAvailability("720", "780", config({ blocked: true }))).toEqual({
      status: "unavailable",
      message: "Room 301 is blocked and unavailable.",
    });
  });
});

describe("checkAvailability overlaps", () => {
  it("returns unavailable when the request overlaps an existing booking", () => {
    expect(checkAvailability("630", "700", config())).toEqual({
      status: "unavailable",
      message: "Overlaps existing booking 10:00–11:00.",
    });
  });

  it("allows a request that ends exactly when a booking starts", () => {
    expect(checkAvailability("560", "600", config()).status).toBe("available");
  });

  it("allows a request that starts exactly when a booking ends", () => {
    expect(checkAvailability("660", "720", config()).status).toBe("available");
  });
});

describe("checkAvailability bookings array", () => {
  it("leaves the bookings array unchanged after a check", () => {
    const bookings: [number, number][] = [[600, 660]];
    const snapshot = JSON.parse(JSON.stringify(bookings));

    checkAvailability("630", "700", config({ bookings }));
    checkAvailability("720", "780", config({ bookings }));

    expect(bookings).toEqual(snapshot);
  });

  it("does not mutate frozen booking data on any result path", () => {
    const frozen: [number, number][] = [Object.freeze([600, 660]) as [number, number]];
    Object.freeze(frozen);
    const snapshot = JSON.parse(JSON.stringify(frozen));

    expect(() => {
      checkAvailability("630", "700", config({ bookings: frozen }));
      checkAvailability("720", "780", config({ bookings: frozen }));
      checkAvailability("720", "780", config({ bookings: frozen, blocked: true }));
      checkAvailability("780", "720", config({ bookings: frozen }));
    }).not.toThrow();

    expect(frozen).toEqual(snapshot);
  });
});
