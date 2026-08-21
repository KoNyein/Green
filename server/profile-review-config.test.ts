import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function testContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("profile review configuration", () => {
  it("exposes the configured review requirement through the lightweight API contract", async () => {
    const result = await appRouter.createCaller(testContext()).gwave.config.profileReviewRequired();
    expect(result).toEqual({ required: process.env.GWAVE_PROFILE_REVIEW_REQUIRED === "true" });
    expect(result.required).toBe(true);
  });
});
