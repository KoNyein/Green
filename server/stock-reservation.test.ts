import { describe, expect, it } from "vitest";
import { coversReservation, isReservationActive, STOCK_RESERVATION_TTL_MS } from "./stock-reservation";

describe("stock reservation rules", () => {
  it("uses a fifteen-minute reservation window", () => {
    expect(STOCK_RESERVATION_TTL_MS).toBe(15 * 60 * 1000);
  });

  it("accepts only active reservations that have not expired", () => {
    expect(isReservationActive("active", new Date(2_000), 1_999)).toBe(true);
    expect(isReservationActive("active", new Date(2_000), 2_000)).toBe(false);
    expect(isReservationActive("released", new Date(3_000), 1_000)).toBe(false);
  });

  it("covers only the same variant within the reserved quantity", () => {
    expect(coversReservation(7, 2, 7, 1)).toBe(true);
    expect(coversReservation(7, 2, 7, 2)).toBe(true);
    expect(coversReservation(7, 2, 7, 3)).toBe(false);
    expect(coversReservation(7, 2, 8, 1)).toBe(false);
    expect(coversReservation(7, 2, null, 1)).toBe(false);
  });
});
