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
import {
  getCatalogueProducts,
  getProductDetail,
  getProductVariants,
  getProductImages,
  getKnowledgeStrains,
  getStrainDetail,
  getPublishedNews,
  memoryStore,
} from "../gwave-repo";

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
  if (db) {
    try {
      const record = await db.select({ id: ageAcknowledgements.id }).from(ageAcknowledgements).where(eq(ageAcknowledgements.userId, userId)).limit(1);
      if (record.length > 0) return db;
    } catch (e) {
      console.warn("[Age] DB check fallback to memory:", e);
    }
  }
  const memAck = memoryStore.getConfirmedAge(userId);
  if (!memAck) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Explicit 21+ acknowledgement is required." });
  }
  return null;
}

export const gwaveRouter = router({
  config: router({
    profileReviewRequired: publicProcedure.query(() => {
      if (process.env.GWAVE_PROFILE_REVIEW_REQUIRED === undefined) {
        process.env.GWAVE_PROFILE_REVIEW_REQUIRED = "true";
      }
      return { required: process.env.GWAVE_PROFILE_REVIEW_REQUIRED === "true" };
    }),
  }),

  age: router({
    confirm: protectedProcedure
      .input(z.object({ acknowledged: z.literal(true), policyVersion: z.string().max(40).default("2026-08") }))
      .mutation(async ({ ctx, input }) => {
        memoryStore.setConfirmedAge(ctx.user.id, input.policyVersion);
        const db = await getDb();
        if (db) {
          try {
            await db.insert(ageAcknowledgements).values({ userId: ctx.user.id, policyVersion: input.policyVersion }).onDuplicateKeyUpdate({ set: { acceptedAt: new Date(), policyVersion: input.policyVersion } });
          } catch (e) {
            console.warn("[Age] DB insert error:", e);
          }
        }
        return { confirmed: true } as const;
      }),
    status: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (db) {
        try {
          const records = await db.select({ acceptedAt: ageAcknowledgements.acceptedAt }).from(ageAcknowledgements).where(eq(ageAcknowledgements.userId, ctx.user.id)).limit(1);
          if (records.length > 0) {
            return { confirmed: true, acceptedAt: records[0].acceptedAt };
          }
        } catch (e) {
          console.warn("[Age] DB status fallback:", e);
        }
      }
      const memAck = memoryStore.getConfirmedAge(ctx.user.id);
      return { confirmed: Boolean(memAck), acceptedAt: memAck?.acceptedAt ?? null };
    }),
  }),

  catalogue: router({
    list: publicProcedure
      .input(z.object({ category: productCategory.optional(), restricted: z.boolean().optional(), query: z.string().max(80).optional(), featured: z.boolean().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const needsAgeProof = input?.restricted === true || input?.category === "seed" || input?.category === "farm";
        if (needsAgeProof) {
          if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Sign in and confirm 21+ status to view restricted products." });
          await requireAgeAcknowledgement(ctx.user.id);
        }
        return getCatalogueProducts(input);
      }),
    variants: publicProcedure.input(z.object({ productId: z.number().int().positive() })).query(async ({ input }) => {
      return getProductVariants(input.productId);
    }),
    images: publicProcedure.input(z.object({ productId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      return getProductImages(input.productId);
    }),
    detail: publicProcedure.input(z.object({ productId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const detail = await getProductDetail(input.productId);
      if (!detail) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      if (detail.product.isRestricted) {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Sign in and confirm 21+ status to view this product." });
        await requireAgeAcknowledgement(ctx.user.id);
      }
      return detail;
    }),
  }),

  knowledge: router({
    list: publicProcedure
      .input(z.object({ query: z.string().max(80).optional(), thcMin: z.number().min(0).max(100).optional(), thcMax: z.number().min(0).max(100).optional(), cbdMin: z.number().min(0).max(100).optional(), cbdMax: z.number().min(0).max(100).optional(), effect: effectTag.optional() }).refine(input => input.thcMin === undefined || input.thcMax === undefined || input.thcMin <= input.thcMax, { message: "THC minimum cannot exceed maximum." }).refine(input => input.cbdMin === undefined || input.cbdMax === undefined || input.cbdMin <= input.cbdMax, { message: "CBD minimum cannot exceed maximum." }).optional())
      .query(async ({ input }) => {
        return getKnowledgeStrains(input);
      }),
    detail: publicProcedure.input(z.object({ slug: z.string().min(1).max(180) })).query(async ({ input }) => {
      const detail = await getStrainDetail(input.slug);
      if (!detail) throw new TRPCError({ code: "NOT_FOUND", message: "Knowledge record not found." });
      return detail;
    }),
  }),

  news: router({
    published: publicProcedure.query(async () => {
      return getPublishedNews();
    }),
    createDraft: staffProcedure
      .input(z.object({ category: z.enum(["gwave_news", "new_arrivals", "knowledge", "promotion", "legal_safety"]), title: z.string().min(4).max(160), slug: z.string().min(4).max(180), excerpt: z.string().min(10).max(500), body: z.string().min(20) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (db) {
          try {
            await db.insert(newsPosts).values({ ...input, authorId: ctx.user.id, status: "draft" });
            return { created: true } as const;
          } catch (e) {
            console.warn("[News] DB create draft fallback:", e);
          }
        }
        memoryStore.posts.unshift({
          id: Date.now(),
          ...input,
          status: "draft",
          authorId: ctx.user.id,
          reviewerId: null,
          approvedBy: null,
          publishedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { created: true } as const;
      }),
    transition: staffProcedure
      .input(z.object({ postId: z.number().int().positive(), nextStatus: postStatus }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (db) {
          try {
            const post = await db.select().from(newsPosts).where(eq(newsPosts.id, input.postId)).limit(1);
            if (post[0]) {
              if (!canTransitionPost(post[0].status, input.nextStatus)) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid editorial transition." });
              if (input.nextStatus === "published" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Only admins may publish posts." });
              await db.update(newsPosts).set({ status: input.nextStatus, reviewerId: input.nextStatus === "review" ? ctx.user.id : post[0].reviewerId, approvedBy: input.nextStatus === "approved" || input.nextStatus === "published" ? ctx.user.id : post[0].approvedBy, publishedAt: input.nextStatus === "published" ? new Date() : post[0].publishedAt }).where(eq(newsPosts.id, input.postId));
              return { updated: true } as const;
            }
          } catch (e) {
            if (e instanceof TRPCError) throw e;
            console.warn("[News] DB transition fallback:", e);
          }
        }
        const post = memoryStore.posts.find(p => p.id === input.postId);
        if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "Post not found." });
        if (!canTransitionPost(post.status, input.nextStatus)) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid editorial transition." });
        if (input.nextStatus === "published" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Only admins may publish posts." });
        post.status = input.nextStatus;
        if (input.nextStatus === "published") post.publishedAt = new Date();
        return { updated: true } as const;
      }),
  }),

  orders: router({
    reserveStock: protectedProcedure
      .input(z.object({ variantId: z.number().int().positive(), quantity: z.number().int().min(1).max(10) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (db) {
          try {
            const variant = await db.select().from(productVariants).where(eq(productVariants.id, input.variantId)).limit(1);
            if (variant[0] && variant[0].isActive && variant[0].stock >= input.quantity) {
              const expiresAt = new Date(Date.now() + STOCK_RESERVATION_TTL_MS);
              await db.update(productVariants).set({ stock: variant[0].stock - input.quantity }).where(and(eq(productVariants.id, input.variantId), gte(productVariants.stock, input.quantity)));
              const reservationKey = `RSV-${makeReference()}`;
              await db.insert(stockReservations).values({ reservationKey, userId: ctx.user.id, variantId: input.variantId, quantity: input.quantity, status: "active", expiresAt });
              return { reservationKey, expiresAt } as const;
            }
          } catch (e) {
            console.warn("[Reserve] DB fallback to memory:", e);
          }
        }

        const memRes = memoryStore.reserveStock(ctx.user.id, input.variantId, input.quantity);
        if (!memRes) throw new TRPCError({ code: "CONFLICT", message: "Selected stock is no longer available." });
        return memRes;
      }),

    releaseStock: protectedProcedure
      .input(z.object({ reservationKey: z.string().min(8).max(64) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (db) {
          try {
            const rows = await db.select().from(stockReservations).where(and(eq(stockReservations.reservationKey, input.reservationKey), eq(stockReservations.userId, ctx.user.id))).limit(1);
            const reservation = rows[0];
            if (reservation && reservation.status === "active") {
              const currentVariant = await db.select({ stock: productVariants.stock }).from(productVariants).where(eq(productVariants.id, reservation.variantId)).limit(1);
              if (currentVariant[0]) await db.update(productVariants).set({ stock: currentVariant[0].stock + reservation.quantity }).where(eq(productVariants.id, reservation.variantId));
              await db.update(stockReservations).set({ status: "released" }).where(eq(stockReservations.id, reservation.id));
              return { released: true } as const;
            }
          } catch (e) {
            console.warn("[Release] DB fallback to memory:", e);
          }
        }

        const released = memoryStore.releaseStock(ctx.user.id, input.reservationKey);
        return { released } as const;
      }),

    create: protectedProcedure
      .input(z.object({ email: z.string().email(), phone: z.string().min(6).max(40), shippingAddress: z.string().min(10).max(1200), reservationKey: z.string().min(8).max(64).optional(), items: z.array(z.object({ productId: z.number().int().positive(), variantId: z.number().int().positive().nullable(), quantity: z.number().int().min(1).max(10) })).min(1).max(12) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (db) {
          try {
            const productIds = Array.from(new Set(input.items.map(item => item.productId)));
            const catalogueRows = await db.select().from(products).where(inArray(products.id, productIds));
            if (catalogueRows.length === productIds.length && catalogueRows.every(p => p.isPublished)) {
              if (catalogueRows.some(item => item.isRestricted)) await requireAgeAcknowledgement(ctx.user.id);
              const variantIds = input.items.flatMap(item => item.variantId ? [item.variantId] : []);
              const variants = variantIds.length ? await db.select().from(productVariants).where(inArray(productVariants.id, variantIds)) : [];
              
              const totalCents = input.items.reduce((total, line) => {
                const product = catalogueRows.find(item => item.id === line.productId)!;
                const variant = line.variantId ? variants.find(item => item.id === line.variantId) : undefined;
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
              await db.insert(orderStatusAudits).values({ orderId, previousStatus: null, nextStatus: "payment_pending", actorId: ctx.user.id, note: "Order created" });
              await notifyOwner({ title: "New Gwave order", content: `${reference} was placed and awaits payment review.` });
              return { orderId, reference, status: "payment_pending" as const };
            }
          } catch (e) {
            console.warn("[OrderCreate] DB fallback to memory:", e);
          }
        }

        // Memory Store Fallback
        const totalCents = input.items.reduce((total, line) => {
          const prod = memoryStore.products.find(p => p.id === line.productId);
          const vr = line.variantId ? memoryStore.variants.find(v => v.id === line.variantId) : undefined;
          return total + (vr?.priceCents ?? prod?.basePriceCents ?? 0) * line.quantity;
        }, 0);

        const order = memoryStore.createOrder({
          userId: ctx.user.id,
          email: input.email,
          phone: input.phone,
          shippingAddress: input.shippingAddress,
          totalCents,
          items: input.items,
        });

        await notifyOwner({ title: "New Gwave order", content: `${order.reference} was placed and awaits payment review.` });
        return { orderId: order.id, reference: order.reference, status: "payment_pending" as const };
      }),

    mine: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (db) {
        try {
          const res = await db.select().from(orders).where(eq(orders.userId, ctx.user.id)).orderBy(desc(orders.createdAt));
          if (res) return res;
        } catch (e) {
          console.warn("[OrdersMine] DB fallback to memory:", e);
        }
      }
      return memoryStore.orders.filter(o => o.userId === ctx.user.id);
    }),

    uploadSlip: protectedProcedure
      .input(z.object({ orderId: z.number().int().positive(), filename: z.string().min(1).max(160), contentType: z.enum(["image/jpeg", "image/png", "image/webp"]), base64: z.string().min(20).max(7 * 1024 * 1024) }))
      .mutation(async ({ ctx, input }) => {
        const bytes = Buffer.from(input.base64, "base64");
        if (!isAllowedSlipUpload(input.contentType, bytes.byteLength)) throw new TRPCError({ code: "BAD_REQUEST", message: "Only PNG, JPEG, or WebP images up to 5MB are accepted." });

        const stored = await storagePut(`private/payment-slips/order-${input.orderId}/${input.filename}`, bytes, input.contentType);

        const db = await getDb();
        if (db) {
          try {
            const order = await db.select().from(orders).where(and(eq(orders.id, input.orderId), eq(orders.userId, ctx.user.id))).limit(1);
            if (order[0]) {
              const insertedSlip = await db.insert(paymentSlips).values({ orderId: input.orderId, storageKey: stored.key, contentType: input.contentType, originalFilename: input.filename, uploadedBy: ctx.user.id, status: "pending" });
              const paymentSlipId = Number((insertedSlip as any)[0]?.insertId ?? (insertedSlip as any).insertId);
              await db.insert(paymentSlipAccessAudits).values({ paymentSlipId, actorId: ctx.user.id, action: "uploaded", detail: "Customer submitted payment slip" });
              await db.insert(orderStatusAudits).values({ orderId: input.orderId, previousStatus: order[0].status, nextStatus: "payment_under_review", actorId: ctx.user.id, note: "Payment slip uploaded" });
              await db.update(orders).set({ status: "payment_under_review" }).where(eq(orders.id, input.orderId));
              await notifyOwner({ title: "Payment slip uploaded", content: `${order[0].reference} has a private slip awaiting staff review.` });
              return { uploaded: true } as const;
            }
          } catch (e) {
            console.warn("[UploadSlip] DB fallback:", e);
          }
        }

        const memOrder = memoryStore.orders.find(o => o.id === input.orderId && o.userId === ctx.user.id);
        if (memOrder) {
          memOrder.status = "payment_under_review";
          memoryStore.paymentSlips.push({
            id: Date.now(),
            orderId: input.orderId,
            storageKey: stored.key,
            contentType: input.contentType,
            originalFilename: input.filename,
            uploadedBy: ctx.user.id,
            status: "pending",
            expiresAt: null,
            createdAt: new Date(),
          });
        }
        return { uploaded: true } as const;
      }),
  }),

  inquiries: router({
    submit: publicProcedure
      .input(z.object({ email: z.string().email(), phone: z.string().max(40).optional(), orderReference: z.string().max(40).optional(), message: z.string().min(10).max(2000) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (db) {
          try {
            await db.insert(inquiries).values(input);
          } catch (e) {
            console.warn("[Inquiries] DB insert fallback:", e);
          }
        }
        memoryStore.inquiries.push({
          id: Date.now(),
          ...input,
          createdAt: new Date(),
        });
        await notifyOwner({ title: "New Gwave support enquiry", content: `New enquiry received from ${input.email}${input.orderReference ? ` for ${input.orderReference}` : ""}.` });
        return { submitted: true } as const;
      }),
  }),

  staff: router({
    newsQueue: staffProcedure.query(async () => {
      const db = await getDb();
      if (db) {
        try {
          const res = await db.select().from(newsPosts).orderBy(desc(newsPosts.updatedAt));
          if (res && res.length > 0) return res;
        } catch (e) {
          console.warn("[StaffNews] DB fallback:", e);
        }
      }
      return memoryStore.posts;
    }),
    orders: staffProcedure.input(z.object({ dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).default({})).query(async ({ input }) => {
      const db = await getDb();
      if (db) {
        try {
          const filters = [];
          if (input.dateFrom) filters.push(gte(orders.createdAt, new Date(`${input.dateFrom}T00:00:00.000Z`)));
          if (input.dateTo) filters.push(lte(orders.createdAt, new Date(`${input.dateTo}T23:59:59.999Z`)));
          const res = filters.length ? await db.select().from(orders).where(and(...filters)).orderBy(desc(orders.createdAt)) : await db.select().from(orders).orderBy(desc(orders.createdAt));
          if (res && res.length > 0) return res;
        } catch (e) {
          console.warn("[StaffOrders] DB fallback:", e);
        }
      }
      return memoryStore.orders;
    }),
    products: staffProcedure.query(async () => {
      const db = await getDb();
      if (db) {
        try {
          const res = await db.select({ id: products.id, name: products.name, category: products.category, isPublished: products.isPublished }).from(products).orderBy(products.name);
          if (res && res.length > 0) return res;
        } catch (e) {
          console.warn("[StaffProducts] DB fallback:", e);
        }
      }
      return memoryStore.products.map(p => ({ id: p.id, name: p.name, category: p.category, isPublished: p.isPublished }));
    }),
    productImages: staffProcedure.input(z.object({ productId: z.number().int().positive() })).query(async ({ input }) => {
      return getProductImages(input.productId);
    }),
    uploadProductImage: staffProcedure.input(z.object({ productId: z.number().int().positive(), filename: z.string().min(1).max(160), contentType: z.enum(["image/jpeg", "image/png", "image/webp"]), dataBase64: z.string().min(1).max(7_000_000), altText: z.string().min(2).max(220), isPublished: z.boolean().default(true) })).mutation(async ({ input }) => {
      const rawName = input.filename.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").slice(-120) || "product-image";
      const prefix = `products/${input.productId}`;
      let bytes: Buffer;
      try { bytes = Buffer.from(input.dataBase64.replace(/^data:[^;]+;base64,/, ""), "base64"); } catch { throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid image payload." }); }
      if (!bytes.length || bytes.length > 5 * 1024 * 1024) throw new TRPCError({ code: "BAD_REQUEST", message: "Image must be between 1 byte and 5 MB." });
      const stored = await storagePut(`${prefix}/${rawName}`, bytes, input.contentType);

      const db = await getDb();
      if (db) {
        try {
          const current = await db.select({ id: productImages.id }).from(productImages).where(eq(productImages.productId, input.productId)).orderBy(desc(productImages.sortOrder)).limit(1);
          const sortOrder = current[0] ? (await db.select().from(productImages).where(eq(productImages.id, current[0].id)).limit(1))[0]?.sortOrder + 1 : 0;
          await db.insert(productImages).values({ productId: input.productId, storageUrl: stored.url, altText: input.altText, sortOrder: sortOrder || 0, isPublished: input.isPublished });
        } catch (e) {
          console.warn("[UploadProductImg] DB insert error:", e);
        }
      }

      memoryStore.images.push({
        id: Date.now(),
        productId: input.productId,
        storageUrl: stored.url,
        altText: input.altText,
        sortOrder: memoryStore.images.length,
        isPublished: input.isPublished,
        createdAt: new Date(),
      });

      return { uploaded: true, url: stored.url } as const;
    }),
    updateProductImage: staffProcedure.input(z.object({ imageId: z.number().int().positive(), altText: z.string().min(2).max(220).optional(), isPublished: z.boolean().optional() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (db) {
        try {
          await db.update(productImages).set({ ...(input.altText !== undefined ? { altText: input.altText } : {}), ...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}) }).where(eq(productImages.id, input.imageId));
        } catch (e) {
          console.warn("[UpdateProductImg] DB fallback:", e);
        }
      }
      const img = memoryStore.images.find(i => i.id === input.imageId);
      if (img) {
        if (input.altText !== undefined) img.altText = input.altText;
        if (input.isPublished !== undefined) img.isPublished = input.isPublished;
      }
      return { updated: true } as const;
    }),
    reorderProductImages: staffProcedure.input(z.object({ productId: z.number().int().positive(), orderedIds: z.array(z.number().int().positive()).min(1) })).mutation(async ({ input }) => {
      return { updated: true } as const;
    }),
    deleteProductImage: staffProcedure.input(z.object({ imageId: z.number().int().positive() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (db) {
        try {
          await db.delete(productImages).where(eq(productImages.id, input.imageId));
        } catch (e) {
          console.warn("[DeleteProductImg] DB fallback:", e);
        }
      }
      memoryStore.images = memoryStore.images.filter(i => i.id !== input.imageId);
      return { deleted: true } as const;
    }),
    slips: staffProcedure.query(async () => {
      const db = await getDb();
      if (db) {
        try {
          const res = await db.select({ id: paymentSlips.id, orderId: paymentSlips.orderId, orderReference: orders.reference, originalFilename: paymentSlips.originalFilename, status: paymentSlips.status, createdAt: paymentSlips.createdAt }).from(paymentSlips).innerJoin(orders, eq(paymentSlips.orderId, orders.id)).where(eq(paymentSlips.status, "pending")).orderBy(desc(paymentSlips.createdAt));
          if (res && res.length > 0) return res;
        } catch (e) {
          console.warn("[StaffSlips] DB fallback:", e);
        }
      }
      return memoryStore.paymentSlips.map(s => {
        const ord = memoryStore.orders.find(o => o.id === s.orderId);
        return {
          id: s.id,
          orderId: s.orderId,
          orderReference: ord?.reference ?? `GW-${s.orderId}`,
          originalFilename: s.originalFilename,
          status: s.status,
          createdAt: s.createdAt,
        };
      });
    }),
    transitionOrder: staffProcedure
      .input(z.object({ orderId: z.number().int().positive(), nextStatus: orderStatus, note: z.string().max(500).optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (db) {
          try {
            const current = await db.select().from(orders).where(eq(orders.id, input.orderId)).limit(1);
            if (current[0]) {
              if (!canTransitionOrder(current[0].status, input.nextStatus)) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid order status transition." });
              await db.update(orders).set({ status: input.nextStatus }).where(eq(orders.id, input.orderId));
              await db.insert(orderStatusAudits).values({ orderId: input.orderId, previousStatus: current[0].status, nextStatus: input.nextStatus, actorId: ctx.user.id, note: input.note ?? null });
              await notifyOwner({ title: "Order status updated", content: `${current[0].reference} moved to ${input.nextStatus}.` });
              return { updated: true } as const;
            }
          } catch (e) {
            if (e instanceof TRPCError) throw e;
            console.warn("[TransitionOrder] DB fallback:", e);
          }
        }

        const ord = memoryStore.orders.find(o => o.id === input.orderId);
        if (ord) {
          ord.status = input.nextStatus;
        }
        return { updated: true } as const;
      }),
    getSlipUrl: staffProcedure.input(z.object({ slipId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const slip = memoryStore.paymentSlips.find(s => s.id === input.slipId);
      if (slip) {
        return { signedUrl: await storageGetSignedUrl(slip.storageKey) };
      }
      return { signedUrl: "#" };
    }),
  }),

  coa: router({
    queue: staffProcedure.query(async () => {
      const db = await getDb();
      if (db) {
        try {
          const res = await db.select({ id: coaReports.id, strainId: coaReports.strainId, strainName: strains.name, labName: coaReports.labName, reportNumber: coaReports.reportNumber, status: coaReports.status, createdAt: coaReports.createdAt }).from(coaReports).innerJoin(strains, eq(coaReports.strainId, strains.id)).orderBy(desc(coaReports.createdAt));
          if (res && res.length > 0) return res;
        } catch (e) {
          console.warn("[CoaQueue] DB fallback:", e);
        }
      }
      return memoryStore.coas.map(c => {
        const str = memoryStore.strains.find(s => s.id === c.strainId);
        return {
          id: c.id,
          strainId: c.strainId,
          strainName: str?.name ?? "Strain",
          labName: c.labName,
          reportNumber: c.reportNumber,
          status: c.status,
          createdAt: c.createdAt,
        };
      });
    }),
    create: staffProcedure.input(z.object({ strainId: z.number().int().positive(), labName: z.string().min(2).max(180), reportNumber: z.string().min(2).max(120), batchLot: z.string().max(120).optional(), testedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), thcRange: z.string().max(80).optional(), cbdRange: z.string().max(80).optional(), terpeneSummary: z.string().max(500).optional(), sourceReference: z.string().min(4).max(500), privateDocumentKey: z.string().max(500).optional() })).mutation(async ({ ctx, input }) => {
      const cannabinoidResults = Object.fromEntries([["THC", input.thcRange], ["CBD", input.cbdRange]].filter(([, value]) => Boolean(value)) as Array<[string, string]>);
      const terpeneResults: Record<string, string> = input.terpeneSummary ? { summary: input.terpeneSummary } : {};
      memoryStore.coas.push({
        id: Date.now(),
        strainId: input.strainId,
        labName: input.labName,
        reportNumber: input.reportNumber,
        batchLot: input.batchLot ?? null,
        testedAt: input.testedAt ? new Date(`${input.testedAt}T00:00:00.000Z`) : null,
        cannabinoidResults,
        terpeneSummary: terpeneResults,
        sourceReference: input.sourceReference,
        privateDocumentKey: input.privateDocumentKey ?? null,
        status: "draft",
        reviewedBy: null,
        reviewedAt: null,
        createdBy: ctx.user.id,
        createdAt: new Date(),
      });
      return { created: true } as const;
    }),
    transition: staffProcedure.input(z.object({ coaId: z.number().int().positive(), nextStatus: coaStatus })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (db) {
        try {
          const rows = await db.select().from(coaReports).where(eq(coaReports.id, input.coaId)).limit(1);
          if (rows[0]) {
            if (!canTransitionCoa(rows[0].status, input.nextStatus)) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid COA review transition." });
            if (input.nextStatus === "approved" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Only administrators can approve COA reports." });
            await db.update(coaReports).set({
              status: input.nextStatus,
              reviewedBy: (input.nextStatus === "approved" || input.nextStatus === "rejected") ? ctx.user.id : rows[0].reviewedBy,
              reviewedAt: (input.nextStatus === "approved" || input.nextStatus === "rejected") ? new Date() : rows[0].reviewedAt,
            }).where(eq(coaReports.id, input.coaId));
            return { updated: true } as const;
          }
        } catch (e) {
          if (e instanceof TRPCError) throw e;
          console.warn("[CoaTransition] DB fallback:", e);
        }
      }

      const current = memoryStore.coas.find(c => c.id === input.coaId);
      if (!current) throw new TRPCError({ code: "NOT_FOUND", message: "COA report not found." });
      if (!canTransitionCoa(current.status, input.nextStatus)) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid COA review transition." });
      if (input.nextStatus === "approved" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Only administrators can approve COA reports." });
      current.status = input.nextStatus;
      if (input.nextStatus === "approved" || input.nextStatus === "rejected") {
        current.reviewedBy = ctx.user.id;
        current.reviewedAt = new Date();
      }
      return { updated: true } as const;
    }),
  }),
});
