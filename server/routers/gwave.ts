import { TRPCError } from "@trpc/server";
import { and, desc, eq, gte, inArray, like, lte } from "drizzle-orm";
import { z } from "zod";
import {
  ageAcknowledgements,
  coaReports,
  inquiries,
  newsPosts,
  orderItems,
  orderStatusAudits,
  orders,
  paymentSlipAccessAudits,
  paymentSlips,
  products,
  productImages,
  productVariants,
  stockReservations,
  strains,
} from "../../drizzle/schema";
import { getDb } from "../db";
import { notifyOwner } from "../_core/notification";
import { storageGetSignedUrl, storagePut } from "../storage";
import {
  canTransitionOrder,
  canTransitionPost,
  canTransitionCoa,
  COA_STATUSES,
  EFFECT_TAGS,
  isAllowedSlipUpload,
  matchesStrainProfileFilters,
  ORDER_STATUSES,
  POST_STATUSES,
} from "../gwave-workflows";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { coversReservation, isReservationActive, STOCK_RESERVATION_TTL_MS } from "../stock-reservation";

const productCategory = z.enum(["seed", "farm", "merch"]);
const orderStatus = z.enum(ORDER_STATUSES);
const postStatus = z.enum(POST_STATUSES);
const effectTag = z.enum(EFFECT_TAGS);
const coaStatus = z.enum(COA_STATUSES);

const staffProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "staff" && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Staff access is required." });
  }
  return next({ ctx });
});

function makeReference() {
  return `GW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

async function requireAgeAcknowledgement(userId: number) {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
  const record = await db.select({ id: ageAcknowledgements.id }).from(ageAcknowledgements).where(eq(ageAcknowledgements.userId, userId)).limit(1);
  if (!record.length) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Explicit 21+ acknowledgement is required." });
  }
  return db;
}

export const gwaveRouter = router({
  config: router({
    profileReviewRequired: publicProcedure.query(() => ({ required: process.env.GWAVE_PROFILE_REVIEW_REQUIRED === "true" })),
  }),
  age: router({
    confirm: protectedProcedure
      .input(z.object({ acknowledged: z.literal(true), policyVersion: z.string().max(40).default("2026-08") }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
        await db.insert(ageAcknowledgements).values({ userId: ctx.user.id, policyVersion: input.policyVersion }).onDuplicateKeyUpdate({ set: { acceptedAt: new Date(), policyVersion: input.policyVersion } });
        return { confirmed: true } as const;
      }),
    status: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { confirmed: false } as const;
      const records = await db.select({ acceptedAt: ageAcknowledgements.acceptedAt }).from(ageAcknowledgements).where(eq(ageAcknowledgements.userId, ctx.user.id)).limit(1);
      return { confirmed: records.length > 0, acceptedAt: records[0]?.acceptedAt ?? null };
    }),
  }),

  catalogue: router({
    list: publicProcedure
      .input(z.object({ category: productCategory.optional(), restricted: z.boolean().optional(), query: z.string().max(80).optional(), featured: z.boolean().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        const needsAgeProof = input?.restricted === true || input?.category === "seed" || input?.category === "farm";
        if (needsAgeProof) {
          if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Sign in and confirm 21+ status to view restricted products." });
          await requireAgeAcknowledgement(ctx.user.id);
        }
        const clauses = [eq(products.isPublished, true)];
        if (input?.category) clauses.push(eq(products.category, input.category));
        if (input?.restricted === true) clauses.push(eq(products.isRestricted, true));
        if (input?.featured === true) clauses.push(eq(products.isFeatured, true));
        if (input?.query?.trim()) clauses.push(like(products.name, `%${input.query.trim()}%`));
        if (!needsAgeProof) clauses.push(eq(products.isRestricted, false));
        return db.select().from(products).where(and(...clauses)).orderBy(desc(products.isFeatured), desc(products.createdAt));
      }),
    variants: publicProcedure.input(z.object({ productId: z.number().int().positive() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const product = await db.select({ isRestricted: products.isRestricted, isPublished: products.isPublished }).from(products).where(eq(products.id, input.productId)).limit(1);
      if (!product[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      if (!product[0].isPublished) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      if (product[0].isRestricted) throw new TRPCError({ code: "FORBIDDEN", message: "Restricted product variants require verified catalogue access." });
      return db.select().from(productVariants).where(eq(productVariants.productId, input.productId));
    }),
    images: publicProcedure.input(z.object({ productId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      const product = await db.select({ isRestricted: products.isRestricted, isPublished: products.isPublished }).from(products).where(eq(products.id, input.productId)).limit(1);
      if (!product[0] || !product[0].isPublished) return [];
      if (product[0].isRestricted) {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Sign in and confirm 21+ status to view this product." });
        await requireAgeAcknowledgement(ctx.user.id);
      }
      return db.select().from(productImages).where(and(eq(productImages.productId, input.productId), eq(productImages.isPublished, true))).orderBy(productImages.sortOrder);
    }),
    detail: publicProcedure.input(z.object({ productId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
      const product = await db.select().from(products).where(and(eq(products.id, input.productId), eq(products.isPublished, true))).limit(1);
      if (!product[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      if (product[0].isRestricted) {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Sign in and confirm 21+ status to view this product." });
        await requireAgeAcknowledgement(ctx.user.id);
      }
      const variants = await db.select().from(productVariants).where(eq(productVariants.productId, input.productId));
      const images = await db.select().from(productImages).where(and(eq(productImages.productId, input.productId), eq(productImages.isPublished, true))).orderBy(productImages.sortOrder);
      return { product: product[0], variants: variants.filter(variant => variant.isActive), images };
    }),
  }),

  knowledge: router({
    list: publicProcedure.input(z.object({ query: z.string().max(80).optional(), thcMin: z.number().min(0).max(100).optional(), thcMax: z.number().min(0).max(100).optional(), cbdMin: z.number().min(0).max(100).optional(), cbdMax: z.number().min(0).max(100).optional(), effect: effectTag.optional() }).refine(input => input.thcMin === undefined || input.thcMax === undefined || input.thcMin <= input.thcMax, { message: "THC minimum cannot exceed maximum." }).refine(input => input.cbdMin === undefined || input.cbdMax === undefined || input.cbdMin <= input.cbdMax, { message: "CBD minimum cannot exceed maximum." }).optional()).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const clauses = [eq(strains.isPublished, true)];
      if (input?.query?.trim()) clauses.push(like(strains.name, `%${input.query.trim()}%`));
      if (input?.thcMin !== undefined) clauses.push(gte(strains.thcMaxPercent, input.thcMin.toFixed(2)));
      if (input?.thcMax !== undefined) clauses.push(lte(strains.thcMinPercent, input.thcMax.toFixed(2)));
      if (input?.cbdMin !== undefined) clauses.push(gte(strains.cbdMaxPercent, input.cbdMin.toFixed(2)));
      if (input?.cbdMax !== undefined) clauses.push(lte(strains.cbdMinPercent, input.cbdMax.toFixed(2)));
      const records = await db.select().from(strains).where(and(...clauses)).orderBy(desc(strains.updatedAt));
      return records.filter(record => matchesStrainProfileFilters(record, input ?? {}));
    }),
    detail: publicProcedure.input(z.object({ slug: z.string().min(1).max(180) })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
      const item = await db.select().from(strains).where(and(eq(strains.slug, input.slug), eq(strains.isPublished, true))).limit(1);
      if (!item[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Knowledge record not found." });
      const coa = await db.select({ labName: coaReports.labName, reportNumber: coaReports.reportNumber, batchLot: coaReports.batchLot, testedAt: coaReports.testedAt, cannabinoidResults: coaReports.cannabinoidResults, terpeneSummary: coaReports.terpeneSummary, sourceReference: coaReports.sourceReference, reviewedAt: coaReports.reviewedAt }).from(coaReports).where(and(eq(coaReports.strainId, item[0].id), eq(coaReports.status, "approved"))).orderBy(desc(coaReports.reviewedAt)).limit(1);
      return { record: item[0], coa: coa[0] ?? null };
    }),
  }),

  news: router({
    published: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(newsPosts).where(eq(newsPosts.status, "published")).orderBy(desc(newsPosts.publishedAt));
    }),
    createDraft: staffProcedure
      .input(z.object({ category: z.enum(["gwave_news", "new_arrivals", "knowledge", "promotion", "legal_safety"]), title: z.string().min(4).max(160), slug: z.string().min(4).max(180), excerpt: z.string().min(10).max(500), body: z.string().min(20) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
        await db.insert(newsPosts).values({ ...input, authorId: ctx.user.id, status: "draft" });
        return { created: true } as const;
      }),
    transition: staffProcedure
      .input(z.object({ postId: z.number().int().positive(), nextStatus: postStatus }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
        const post = await db.select().from(newsPosts).where(eq(newsPosts.id, input.postId)).limit(1);
        if (!post[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Post not found." });
        if (!canTransitionPost(post[0].status, input.nextStatus)) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid editorial transition." });
        if (input.nextStatus === "published" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Only admins may publish posts." });
        await db.update(newsPosts).set({ status: input.nextStatus, reviewerId: input.nextStatus === "review" ? ctx.user.id : post[0].reviewerId, approvedBy: input.nextStatus === "approved" || input.nextStatus === "published" ? ctx.user.id : post[0].approvedBy, publishedAt: input.nextStatus === "published" ? new Date() : post[0].publishedAt }).where(eq(newsPosts.id, input.postId));
        return { updated: true } as const;
      }),
  }),

  orders: router({
    reserveStock: protectedProcedure
      .input(z.object({ variantId: z.number().int().positive(), quantity: z.number().int().min(1).max(10) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
        const variant = await db.select().from(productVariants).where(eq(productVariants.id, input.variantId)).limit(1);
        if (!variant[0] || !variant[0].isActive) throw new TRPCError({ code: "NOT_FOUND", message: "Selected variant is unavailable." });
        const expiresAt = new Date(Date.now() + STOCK_RESERVATION_TTL_MS);
        const updated = await db.update(productVariants).set({ stock: variant[0].stock - input.quantity }).where(and(eq(productVariants.id, input.variantId), gte(productVariants.stock, input.quantity)));
        const affectedRows = Number((updated as any)?.[0]?.affectedRows ?? (updated as any)?.affectedRows ?? 0);
        if (!affectedRows) throw new TRPCError({ code: "CONFLICT", message: "Selected stock is no longer available." });
        const reservationKey = `RSV-${makeReference()}`;
        await db.insert(stockReservations).values({ reservationKey, userId: ctx.user.id, variantId: input.variantId, quantity: input.quantity, status: "active", expiresAt });
        return { reservationKey, expiresAt } as const;
      }),
    releaseStock: protectedProcedure
      .input(z.object({ reservationKey: z.string().min(8).max(64) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
        const rows = await db.select().from(stockReservations).where(and(eq(stockReservations.reservationKey, input.reservationKey), eq(stockReservations.userId, ctx.user.id))).limit(1);
        const reservation = rows[0];
        if (!reservation || reservation.status !== "active") return { released: false } as const;
        const currentVariant = await db.select({ stock: productVariants.stock }).from(productVariants).where(eq(productVariants.id, reservation.variantId)).limit(1);
        if (currentVariant[0]) await db.update(productVariants).set({ stock: currentVariant[0].stock + reservation.quantity }).where(eq(productVariants.id, reservation.variantId));
        await db.update(stockReservations).set({ status: "released" }).where(eq(stockReservations.id, reservation.id));
        return { released: true } as const;
      }),
    create: protectedProcedure
      .input(z.object({ email: z.string().email(), phone: z.string().min(6).max(40), shippingAddress: z.string().min(10).max(1200), reservationKey: z.string().min(8).max(64).optional(), items: z.array(z.object({ productId: z.number().int().positive(), variantId: z.number().int().positive().nullable(), quantity: z.number().int().min(1).max(10) })).min(1).max(12) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
        const productIds = Array.from(new Set(input.items.map(item => item.productId)));
        const catalogueRows = await db.select().from(products).where(inArray(products.id, productIds));
        if (catalogueRows.length !== productIds.length) throw new TRPCError({ code: "BAD_REQUEST", message: "One or more products are unavailable." });
        if (catalogueRows.some(item => !item.isPublished)) throw new TRPCError({ code: "BAD_REQUEST", message: "One or more products are not published." });
        if (catalogueRows.some(item => item.isRestricted)) await requireAgeAcknowledgement(ctx.user.id);
        const variantIds = input.items.flatMap(item => item.variantId ? [item.variantId] : []);
        const variants = variantIds.length ? await db.select().from(productVariants).where(inArray(productVariants.id, variantIds)) : [];
        if (variants.length !== variantIds.length) throw new TRPCError({ code: "BAD_REQUEST", message: "One or more selected variants are unavailable." });
        const reservation = input.reservationKey ? (await db.select().from(stockReservations).where(and(eq(stockReservations.reservationKey, input.reservationKey), eq(stockReservations.userId, ctx.user.id))).limit(1))[0] : undefined;
        if (input.reservationKey && (!reservation || !isReservationActive(reservation.status, reservation.expiresAt))) throw new TRPCError({ code: "CONFLICT", message: "The stock reservation has expired or is no longer active." });
        const totalCents = input.items.reduce((total, line) => {
          const product = catalogueRows.find(item => item.id === line.productId)!;
          const variant = line.variantId ? variants.find(item => item.id === line.variantId) : undefined;
          if (variant && variant.productId !== product.id) throw new TRPCError({ code: "BAD_REQUEST", message: "A variant does not belong to the selected product." });
          const coveredByReservation = Boolean(reservation && coversReservation(reservation.variantId, reservation.quantity, line.variantId, line.quantity));
          if (variant && (!variant.isActive || (!coveredByReservation && variant.stock < line.quantity))) throw new TRPCError({ code: "BAD_REQUEST", message: "Selected stock is no longer available." });
          return total + (variant?.priceCents ?? product.basePriceCents) * line.quantity;
        }, 0);
        const reference = makeReference();
        const inserted = await db.insert(orders).values({ reference, userId: ctx.user.id, email: input.email, phone: input.phone, shippingAddress: input.shippingAddress, totalCents, status: "payment_pending" });
        const orderId = Number((inserted as any)[0]?.insertId ?? (inserted as any).insertId);
        await db.insert(orderItems).values(input.items.map(line => {
          const product = catalogueRows.find(item => item.id === line.productId)!;
          const variant = line.variantId ? variants.find(item => item.id === line.variantId) : undefined;
          return { orderId, productId: product.id, variantId: line.variantId, itemName: product.name, unitPriceCents: variant?.priceCents ?? product.basePriceCents, quantity: line.quantity, selectedOptions: variant ? { size: variant.size ?? "", color: variant.color ?? "", label: variant.label } : null };
        }));
        await Promise.all(input.items.filter(line => line.variantId && (!reservation || line.variantId !== reservation.variantId)).map(line => db.update(productVariants).set({ stock: (variants.find(item => item.id === line.variantId)?.stock ?? 0) - line.quantity }).where(eq(productVariants.id, line.variantId!))));
        if (reservation) await db.update(stockReservations).set({ status: "consumed" }).where(eq(stockReservations.id, reservation.id));
        await db.insert(orderStatusAudits).values({ orderId, previousStatus: null, nextStatus: "payment_pending", actorId: ctx.user.id, note: "Order created" });
        await notifyOwner({ title: "New Gwave order", content: `${reference} was placed and awaits payment review.` });
        return { orderId, reference, status: "payment_pending" as const };
      }),
    mine: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(orders).where(eq(orders.userId, ctx.user.id)).orderBy(desc(orders.createdAt));
    }),
    uploadSlip: protectedProcedure
      .input(z.object({ orderId: z.number().int().positive(), filename: z.string().min(1).max(160), contentType: z.enum(["image/jpeg", "image/png", "image/webp"]), base64: z.string().min(20).max(7 * 1024 * 1024) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
        const order = await db.select().from(orders).where(and(eq(orders.id, input.orderId), eq(orders.userId, ctx.user.id))).limit(1);
        if (!order[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
        if (!canTransitionOrder(order[0].status, "payment_under_review")) throw new TRPCError({ code: "BAD_REQUEST", message: "This order is not accepting a new payment slip." });
        const bytes = Buffer.from(input.base64, "base64");
        if (!isAllowedSlipUpload(input.contentType, bytes.byteLength)) throw new TRPCError({ code: "BAD_REQUEST", message: "Only PNG, JPEG, or WebP images up to 5MB are accepted." });
        const stored = await storagePut(`private/payment-slips/order-${input.orderId}/${input.filename}`, bytes, input.contentType);
        const insertedSlip = await db.insert(paymentSlips).values({ orderId: input.orderId, storageKey: stored.key, contentType: input.contentType, originalFilename: input.filename, uploadedBy: ctx.user.id, status: "pending" });
        const paymentSlipId = Number((insertedSlip as any)[0]?.insertId ?? (insertedSlip as any).insertId);
        await db.insert(paymentSlipAccessAudits).values({ paymentSlipId, actorId: ctx.user.id, action: "uploaded", detail: "Customer submitted payment slip" });
        await db.insert(orderStatusAudits).values({ orderId: input.orderId, previousStatus: order[0].status, nextStatus: "payment_under_review", actorId: ctx.user.id, note: "Payment slip uploaded" });
        await db.update(orders).set({ status: "payment_under_review" }).where(eq(orders.id, input.orderId));
        await notifyOwner({ title: "Payment slip uploaded", content: `${order[0].reference} has a private slip awaiting staff review.` });
        return { uploaded: true } as const;
      }),
  }),

  inquiries: router({
    submit: publicProcedure
      .input(z.object({ email: z.string().email(), phone: z.string().max(40).optional(), orderReference: z.string().max(40).optional(), message: z.string().min(10).max(2000) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
        await db.insert(inquiries).values(input);
        await notifyOwner({ title: "New Gwave support enquiry", content: `New enquiry received from ${input.email}${input.orderReference ? ` for ${input.orderReference}` : ""}.` });
        return { submitted: true } as const;
      }),
  }),

  staff: router({
    newsQueue: staffProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(newsPosts).orderBy(desc(newsPosts.updatedAt));
    }),
    orders: staffProcedure.input(z.object({ dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).default({})).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const filters = [];
      if (input.dateFrom) filters.push(gte(orders.createdAt, new Date(`${input.dateFrom}T00:00:00.000Z`)));
      if (input.dateTo) filters.push(lte(orders.createdAt, new Date(`${input.dateTo}T23:59:59.999Z`)));
      return filters.length ? db.select().from(orders).where(and(...filters)).orderBy(desc(orders.createdAt)) : db.select().from(orders).orderBy(desc(orders.createdAt));
    }),
    products: staffProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select({ id: products.id, name: products.name, category: products.category, isPublished: products.isPublished }).from(products).orderBy(products.name);
    }),
    productImages: staffProcedure.input(z.object({ productId: z.number().int().positive() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(productImages).where(eq(productImages.productId, input.productId)).orderBy(productImages.sortOrder, productImages.id);
    }),
    uploadProductImage: staffProcedure.input(z.object({ productId: z.number().int().positive(), filename: z.string().min(1).max(160), contentType: z.enum(["image/jpeg", "image/png", "image/webp"]), dataBase64: z.string().min(1).max(7_000_000), altText: z.string().min(2).max(220), isPublished: z.boolean().default(true) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
      const product = await db.select({ id: products.id }).from(products).where(eq(products.id, input.productId)).limit(1);
      if (!product[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      const rawName = input.filename.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").slice(-120) || "product-image";
      const prefix = `products/${input.productId}`;
      let bytes: Buffer;
      try { bytes = Buffer.from(input.dataBase64.replace(/^data:[^;]+;base64,/, ""), "base64"); } catch { throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid image payload." }); }
      if (!bytes.length || bytes.length > 5 * 1024 * 1024) throw new TRPCError({ code: "BAD_REQUEST", message: "Image must be between 1 byte and 5 MB." });
      const stored = await storagePut(`${prefix}/${rawName}`, bytes, input.contentType);
      const current = await db.select({ id: productImages.id }).from(productImages).where(eq(productImages.productId, input.productId)).orderBy(desc(productImages.sortOrder)).limit(1);
      const sortOrder = current[0] ? (await db.select().from(productImages).where(eq(productImages.id, current[0].id)).limit(1))[0]?.sortOrder + 1 : 0;
      await db.insert(productImages).values({ productId: input.productId, storageUrl: stored.url, altText: input.altText, sortOrder: sortOrder || 0, isPublished: input.isPublished });
      return { uploaded: true, url: stored.url } as const;
    }),
    updateProductImage: staffProcedure.input(z.object({ imageId: z.number().int().positive(), altText: z.string().min(2).max(220).optional(), isPublished: z.boolean().optional() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
      const image = await db.select({ id: productImages.id }).from(productImages).where(eq(productImages.id, input.imageId)).limit(1);
      if (!image[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Product image not found." });
      await db.update(productImages).set({ ...(input.altText !== undefined ? { altText: input.altText } : {}), ...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}) }).where(eq(productImages.id, input.imageId));
      return { updated: true } as const;
    }),
    reorderProductImages: staffProcedure.input(z.object({ productId: z.number().int().positive(), orderedIds: z.array(z.number().int().positive()).min(1) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
      const images = await db.select({ id: productImages.id }).from(productImages).where(eq(productImages.productId, input.productId));
      const existing = new Set(images.map(image => image.id));
      if (images.length !== input.orderedIds.length || input.orderedIds.some(id => !existing.has(id)) || new Set(input.orderedIds).size !== input.orderedIds.length) throw new TRPCError({ code: "BAD_REQUEST", message: "The image order does not match this product." });
      for (let sortOrder = 0; sortOrder < input.orderedIds.length; sortOrder += 1) { const imageId = input.orderedIds[sortOrder]; await db.update(productImages).set({ sortOrder }).where(and(eq(productImages.id, imageId), eq(productImages.productId, input.productId))); }
      return { updated: true } as const;
    }),
    deleteProductImage: staffProcedure.input(z.object({ imageId: z.number().int().positive() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
      const image = await db.select({ id: productImages.id }).from(productImages).where(eq(productImages.id, input.imageId)).limit(1);
      if (!image[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Product image not found." });
      await db.delete(productImages).where(eq(productImages.id, input.imageId));
      return { deleted: true } as const;
    }),
    slips: staffProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select({ id: paymentSlips.id, orderId: paymentSlips.orderId, orderReference: orders.reference, originalFilename: paymentSlips.originalFilename, status: paymentSlips.status, createdAt: paymentSlips.createdAt }).from(paymentSlips).innerJoin(orders, eq(paymentSlips.orderId, orders.id)).where(eq(paymentSlips.status, "pending")).orderBy(desc(paymentSlips.createdAt));
    }),
    transitionOrder: staffProcedure
      .input(z.object({ orderId: z.number().int().positive(), nextStatus: orderStatus, note: z.string().max(500).optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
        const current = await db.select().from(orders).where(eq(orders.id, input.orderId)).limit(1);
        if (!current[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
        if (!canTransitionOrder(current[0].status, input.nextStatus)) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid order status transition." });
        await db.update(orders).set({ status: input.nextStatus }).where(eq(orders.id, input.orderId));
        await db.insert(orderStatusAudits).values({ orderId: input.orderId, previousStatus: current[0].status, nextStatus: input.nextStatus, actorId: ctx.user.id, note: input.note ?? null });
        if (input.nextStatus === "completed") {
          const slips = await db.select({ id: paymentSlips.id }).from(paymentSlips).where(eq(paymentSlips.orderId, input.orderId));
          await db.update(paymentSlips).set({ status: "expired", expiresAt: new Date() }).where(eq(paymentSlips.orderId, input.orderId));
          if (slips.length) await db.insert(paymentSlipAccessAudits).values(slips.map(slip => ({ paymentSlipId: slip.id, actorId: ctx.user.id, action: "expired" as const, detail: "Order completed" })));
        }
        await notifyOwner({ title: "Order status updated", content: `${current[0].reference} moved to ${input.nextStatus}.` });
        return { updated: true } as const;
      }),
    getSlipUrl: staffProcedure.input(z.object({ slipId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
      const slip = await db.select().from(paymentSlips).where(eq(paymentSlips.id, input.slipId)).limit(1);
      if (!slip[0] || slip[0].status === "expired") throw new TRPCError({ code: "NOT_FOUND", message: "Slip is unavailable." });
      await db.insert(paymentSlipAccessAudits).values({ paymentSlipId: slip[0].id, actorId: ctx.user.id, action: "opened", detail: "Staff generated one-time signed retrieval URL" });
      return { signedUrl: await storageGetSignedUrl(slip[0].storageKey) };
    }),
  }),

  coa: router({
    queue: staffProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select({ id: coaReports.id, strainId: coaReports.strainId, strainName: strains.name, labName: coaReports.labName, reportNumber: coaReports.reportNumber, status: coaReports.status, createdAt: coaReports.createdAt }).from(coaReports).innerJoin(strains, eq(coaReports.strainId, strains.id)).orderBy(desc(coaReports.createdAt));
    }),
    create: staffProcedure.input(z.object({ strainId: z.number().int().positive(), labName: z.string().min(2).max(180), reportNumber: z.string().min(2).max(120), batchLot: z.string().max(120).optional(), testedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), thcRange: z.string().max(80).optional(), cbdRange: z.string().max(80).optional(), terpeneSummary: z.string().max(500).optional(), sourceReference: z.string().min(4).max(500), privateDocumentKey: z.string().max(500).optional() })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
      const strain = await db.select({ id: strains.id }).from(strains).where(eq(strains.id, input.strainId)).limit(1);
      if (!strain[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Strain record not found." });
      const cannabinoidResults = Object.fromEntries([["THC", input.thcRange], ["CBD", input.cbdRange]].filter(([, value]) => Boolean(value)) as Array<[string, string]>);
      const terpeneResults: Record<string, string> = input.terpeneSummary ? { summary: input.terpeneSummary } : {};
      await db.insert(coaReports).values({ strainId: input.strainId, labName: input.labName, reportNumber: input.reportNumber, batchLot: input.batchLot ?? null, testedAt: input.testedAt ? new Date(`${input.testedAt}T00:00:00.000Z`) : null, cannabinoidResults, terpeneSummary: terpeneResults, sourceReference: input.sourceReference, privateDocumentKey: input.privateDocumentKey ?? null, status: "draft", createdBy: ctx.user.id });
      return { created: true } as const;
    }),
    transition: staffProcedure.input(z.object({ coaId: z.number().int().positive(), nextStatus: coaStatus })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is unavailable." });
      if (input.nextStatus === "approved" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Only admins may approve a public COA summary." });
      const current = await db.select().from(coaReports).where(eq(coaReports.id, input.coaId)).limit(1);
      if (!current[0]) throw new TRPCError({ code: "NOT_FOUND", message: "COA report not found." });
      if (!canTransitionCoa(current[0].status, input.nextStatus)) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid COA review transition." });
      if (input.nextStatus === "approved" && (!Object.keys(current[0].cannabinoidResults ?? {}).length || !current[0].sourceReference)) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "A source reference and result summary are required before approval." });
      await db.update(coaReports).set({ status: input.nextStatus, reviewedBy: input.nextStatus === "approved" || input.nextStatus === "rejected" ? ctx.user.id : current[0].reviewedBy, reviewedAt: input.nextStatus === "approved" || input.nextStatus === "rejected" ? new Date() : current[0].reviewedAt }).where(eq(coaReports.id, input.coaId));
      return { updated: true } as const;
    }),
  }),
});
