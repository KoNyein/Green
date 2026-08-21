import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getDb: vi.fn() }));
vi.mock("./db", () => ({ getDb: mocks.getDb }));

import { releaseExpiredStockReservations } from "./stock-reservation-cleanup";

describe("expired stock reservation cleanup", () => {
  it("marks only expired active reservations and reports affected rows", async () => {
    const where = vi.fn().mockResolvedValue({ affectedRows: 3 });
    const set = vi.fn(() => ({ where }));
    const db = { update: vi.fn(() => ({ set })) };
    mocks.getDb.mockResolvedValue(db);

    await expect(releaseExpiredStockReservations(new Date("2026-08-21T00:00:00.000Z"))).resolves.toEqual({ released: 3 });
    expect(db.update).toHaveBeenCalledOnce();
    expect(set).toHaveBeenCalledWith({ status: "expired" });
    expect(where).toHaveBeenCalledOnce();
  });
});
