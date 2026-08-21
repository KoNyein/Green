import type { Request, Response } from "express";
import { and, eq, lte } from "drizzle-orm";
import { stockReservations } from "../drizzle/schema";
import { getDb } from "./db";
import { sdk } from "./_core/sdk";

export async function releaseExpiredStockReservations(now = new Date()) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable.");
  const result = await db.update(stockReservations).set({ status: "expired" }).where(and(eq(stockReservations.status, "active"), lte(stockReservations.expiresAt, now)));
  return { released: Number((result as unknown as { affectedRows?: number }).affectedRows ?? 0) };
}

export async function handleReservationCleanup(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });
    const result = await releaseExpiredStockReservations();
    return res.json({ ok: true, taskUid: user.taskUid, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown cleanup error";
    return res.status(500).json({ error: message, context: { url: req.originalUrl }, timestamp: new Date().toISOString() });
  }
}
