import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import { ageAcknowledgements, coaReports, newsPosts, paymentSlipAccessAudits, paymentSlips, productImages, productModels, products } from "../drizzle/schema";

const mocks = vi.hoisted(() => ({
  getDb: vi.fn(),
  notifyOwner: vi.fn().mockResolvedValue(true),
  storagePut: vi.fn().mockResolvedValue({ key: "private/payment-slips/mock.png_1234", url: "/manus-storage/private/payment-slips/mock.png_1234" }),
  storageGetSignedUrl: vi.fn(),
}));

vi.mock("./db", () => ({ getDb: mocks.getDb }));
vi.mock("./_core/notification", () => ({ notifyOwner: mocks.notifyOwner }));
vi.mock("./storage", () => ({ storagePut: mocks.storagePut, storageGetSignedUrl: mocks.storageGetSignedUrl }));

import { appRouter } from "./routers";

function context(role: "user" | "staff" | "admin" = "user"): TrpcContext {
  return {
    user: {
      id: 77,
      openId: "gwave-test-user",
      email: "gwave-test@example.com",
      name: "Gwave Test",
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

describe("Gwave protected procedures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("persists a signed-in 21+ acknowledgement", async () => {
    const acknowledgementUpdate = vi.fn().mockResolvedValue({});
    const db = {
      insert: vi.fn((table: unknown) => {
        if (table === ageAcknowledgements) {
          return { values: vi.fn(() => ({ onDuplicateKeyUpdate: acknowledgementUpdate })) };
        }
        return { values: vi.fn().mockResolvedValue({ insertId: 1 }) };
      }),
    };
    mocks.getDb.mockResolvedValue(db);

    const result = await appRouter.createCaller(context()).gwave.age.confirm({ acknowledged: true });

    expect(result).toEqual({ confirmed: true });
    expect(acknowledgementUpdate).toHaveBeenCalledOnce();
  });

  it("allows an admin to publish only through the approved editorial state", async () => {
    const where = vi.fn().mockResolvedValue({});
    const set = vi.fn(() => ({ where }));
    const db = {
      select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([{ id: 14, status: "approved", reviewerId: 5, approvedBy: 6, publishedAt: null }]) })) })) })),
      update: vi.fn(() => ({ set })),
    };
    mocks.getDb.mockResolvedValue(db);

    await expect(appRouter.createCaller(context("admin")).gwave.news.transition({ postId: 14, nextStatus: "published" })).resolves.toEqual({ updated: true });
    expect(db.update).toHaveBeenCalledWith(newsPosts);
    expect(set).toHaveBeenCalledWith(expect.objectContaining({ status: "published", approvedBy: 77 }));
  });

  it("creates an upload audit when a customer submits a payment slip", async () => {
    const captured: Array<{ table: unknown; values: ReturnType<typeof vi.fn> }> = [];
    const db = {
      select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([{ id: 31, reference: "GW-TEST", status: "payment_pending" }]) })) })) })),
      insert: vi.fn((table: unknown) => {
        const values = vi.fn().mockResolvedValue({ insertId: 44 });
        captured.push({ table, values });
        return { values };
      }),
      update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn().mockResolvedValue({}) })) })),
    };
    mocks.getDb.mockResolvedValue(db);

    await expect(appRouter.createCaller(context()).gwave.orders.uploadSlip({
      orderId: 31,
      filename: "transfer.png",
      contentType: "image/png",
      base64: Buffer.alloc(32, 1).toString("base64"),
    })).resolves.toEqual({ uploaded: true });

    const privateSlipWrite = captured.find(entry => entry.table === paymentSlips);
    const auditWrite = captured.find(entry => entry.table === paymentSlipAccessAudits);
    expect(privateSlipWrite?.values).toHaveBeenCalledOnce();
    expect(auditWrite?.values).toHaveBeenCalledWith(expect.objectContaining({ paymentSlipId: 44, action: "uploaded", actorId: 77 }));
  });

  it("requires an admin to approve a COA summary for public display", async () => {
    const where = vi.fn().mockResolvedValue({});
    const set = vi.fn(() => ({ where }));
    const db = {
      select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([{ id: 18, status: "review", cannabinoidResults: { THC: "20–22%" }, sourceReference: "Lab portal / report 18", reviewedBy: null, reviewedAt: null }]) })) })) })),
      update: vi.fn(() => ({ set })),
    };
    mocks.getDb.mockResolvedValue(db);

    await expect(appRouter.createCaller(context("staff")).gwave.coa.transition({ coaId: 18, nextStatus: "approved" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(appRouter.createCaller(context("admin")).gwave.coa.transition({ coaId: 18, nextStatus: "approved" })).resolves.toEqual({ updated: true });
    expect(db.update).toHaveBeenCalledWith(coaReports);
    expect(set).toHaveBeenCalledWith(expect.objectContaining({ status: "approved", reviewedBy: 77 }));
  });

  it("keeps product image uploads staff-only and stores image metadata through S3", async () => {
    const values = vi.fn().mockResolvedValue({ insertId: 41 });
    const db = {
      select: vi.fn(() => ({ from: vi.fn((table: unknown) => ({ where: vi.fn(() => ({ limit: vi.fn().mockResolvedValue(table === products ? [{ id: 9 }] : []), orderBy: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([]) })) })) })) })),
      insert: vi.fn((table: unknown) => table === productImages ? { values } : { values: vi.fn().mockResolvedValue({}) }),
    };
    mocks.getDb.mockResolvedValue(db);

    await expect(appRouter.createCaller(context("user")).gwave.staff.uploadProductImage({ productId: 9, filename: "signal.png", contentType: "image/png", dataBase64: Buffer.from("png-bytes").toString("base64"), altText: "Signal product" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(appRouter.createCaller(context("staff")).gwave.staff.uploadProductImage({ productId: 9, filename: "signal.png", contentType: "image/png", dataBase64: Buffer.from("png-bytes").toString("base64"), altText: "Signal product" })).resolves.toEqual({ uploaded: true, url: "/manus-storage/private/payment-slips/mock.png_1234" });
    expect(mocks.storagePut).toHaveBeenCalledWith("products/9/signal.png", expect.any(Buffer), "image/png");
    expect(values).toHaveBeenCalledWith(expect.objectContaining({ productId: 9, storageUrl: "/manus-storage/private/payment-slips/mock.png_1234", altText: "Signal product", isPublished: true }));
  });

  it("uploads a valid GLB model as hidden staff-managed media", async () => {
    const values = vi.fn().mockResolvedValue({ insertId: 52 });
    const db = {
      select: vi.fn(() => ({ from: vi.fn((table: unknown) => ({ where: vi.fn(() => ({ limit: vi.fn().mockResolvedValue(table === products ? [{ id: 9 }] : []), orderBy: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([]) })) })) })) })),
      insert: vi.fn(() => ({ values })),
    };
    mocks.getDb.mockResolvedValue(db);

    await expect(appRouter.createCaller(context("staff")).gwave.staff.uploadProductModel({ productId: 9, filename: "signal.glb", contentType: "model/gltf-binary", dataBase64: Buffer.from("glb-bytes").toString("base64"), altText: "Signal 3D model" })).resolves.toEqual({ uploaded: true, url: "/manus-storage/private/payment-slips/mock.png_1234" });
    expect(db.insert).toHaveBeenCalledWith(productModels);
    expect(values).toHaveBeenCalledWith(expect.objectContaining({ productId: 9, originalFilename: "signal.glb", mimeType: "model/gltf-binary", isPublished: false, createdBy: 77 }));
    expect(mocks.storagePut).toHaveBeenCalledWith(expect.stringMatching(/^private\/product-models\/9\//), expect.any(Buffer), "model/gltf-binary");
  });

  it("keeps GLB model uploads staff-only and validates the file contract", async () => {
    await expect(appRouter.createCaller(context("user")).gwave.staff.uploadProductModel({ productId: 9, filename: "signal.glb", contentType: "model/gltf-binary", dataBase64: Buffer.from("glb-bytes").toString("base64"), altText: "Signal 3D model" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(appRouter.createCaller(context("staff")).gwave.staff.uploadProductModel({ productId: 9, filename: "signal.obj", contentType: "application/octet-stream", dataBase64: Buffer.from("obj-bytes").toString("base64"), altText: "Signal 3D model" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("returns an approved public COA summary without a private document key", async () => {
    const record = { id: 4, slug: "verified-record", isPublished: true, name: "Verified Record" };
    const publicCoa = { labName: "Verified Lab", reportNumber: "COA-004", batchLot: "LOT-04", testedAt: new Date("2026-08-01"), cannabinoidResults: { THC: "20–22%" }, terpeneSummary: { summary: "Supplier-provided summary" }, sourceReference: "Lab portal / COA-004", reviewedAt: new Date("2026-08-02") };
    let selectCalls = 0;
    const db = {
      select: vi.fn(() => {
        selectCalls += 1;
        if (selectCalls === 1) return { from: vi.fn(() => ({ where: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([record]) })) })) };
        return { from: vi.fn(() => ({ where: vi.fn(() => ({ orderBy: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([publicCoa]) })) })) })) };
      }),
    };
    mocks.getDb.mockResolvedValue(db);

    const result = await appRouter.createCaller(context()).gwave.knowledge.detail({ slug: "verified-record" });

    expect(result.coa).toMatchObject({ labName: publicCoa.labName, reportNumber: publicCoa.reportNumber, cannabinoidResults: publicCoa.cannabinoidResults });
    expect(result.coa).not.toHaveProperty("sourceReference");
    expect(result.coa).not.toHaveProperty("privateDocumentKey");
  });
});
