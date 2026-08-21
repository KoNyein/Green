import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function userContext(role: "user" | "staff" | "admin"): TrpcContext {
  return {
    user: {
      id: 99,
      openId: "role-check-user",
      email: "role-check@example.com",
      name: "Role Check",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Gwave private-slip access", () => {
  it("rejects ordinary users before a payment-slip retrieval can reach storage", async () => {
    const caller = appRouter.createCaller(userContext("user"));
    await expect(caller.gwave.staff.getSlipUrl({ slipId: 1 })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});
