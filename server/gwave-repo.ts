import { getDb } from "./db";
import {
  products,
  productVariants,
  productImages,
  strains,
  coaReports,
  newsPosts,
  orders,
  orderItems,
  orderStatusAudits,
  paymentSlips,
  paymentSlipAccessAudits,
  stockReservations,
  ageAcknowledgements,
  inquiries,
} from "../drizzle/schema";
import { and, desc, eq, gte, inArray, like, lte } from "drizzle-orm";
import {
  SEED_PRODUCTS,
  SEED_VARIANTS,
  SEED_IMAGES,
  SEED_STRAINS,
  SEED_COAS,
  SEED_POSTS,
  ProductItem,
  VariantItem,
  ImageItem,
  StrainItem,
  CoaReportItem,
  NewsPostItem,
  OrderRecord,
  OrderItemRecord,
  PaymentSlipRecord,
} from "./gwave-data";
import {
  matchesStrainProfileFilters,
  canTransitionOrder,
  canTransitionPost,
  ORDER_STATUSES,
  POST_STATUSES,
  EFFECT_TAGS,
} from "./gwave-workflows";
import { STOCK_RESERVATION_TTL_MS, isReservationActive } from "./stock-reservation";

// In-Memory Fallback State (holds state if database is offline or for local operations)
class MemoryStore {
  products: ProductItem[] = JSON.parse(JSON.stringify(SEED_PRODUCTS));
  variants: VariantItem[] = JSON.parse(JSON.stringify(SEED_VARIANTS));
  images: ImageItem[] = JSON.parse(JSON.stringify(SEED_IMAGES));
  strains: StrainItem[] = JSON.parse(JSON.stringify(SEED_STRAINS));
  coas: CoaReportItem[] = JSON.parse(JSON.stringify(SEED_COAS));
  posts: NewsPostItem[] = JSON.parse(JSON.stringify(SEED_POSTS));
  orders: OrderRecord[] = [];
  orderItems: OrderItemRecord[] = [];
  paymentSlips: PaymentSlipRecord[] = [];
  reservations: { id: number; reservationKey: string; userId: number; variantId: number; quantity: number; status: "active" | "released" | "consumed" | "expired"; expiresAt: Date; createdAt: Date }[] = [];
  ageAcks: Map<number, { policyVersion: string; acceptedAt: Date }> = new Map();
  inquiries: { id: number; email: string; phone?: string; orderReference?: string; message: string; createdAt: Date }[] = [];

  private nextOrderId = 100;
  private nextOrderItemId = 200;
  private nextSlipId = 300;
  private nextResId = 400;

  getConfirmedAge(userId: number) {
    return this.ageAcks.get(userId);
  }

  setConfirmedAge(userId: number, policyVersion: string) {
    this.ageAcks.set(userId, { policyVersion, acceptedAt: new Date() });
  }

  createOrder(data: { userId: number; email: string; phone: string; shippingAddress: string; totalCents: number; items: { productId: number; variantId: number | null; quantity: number }[] }) {
    const id = ++this.nextOrderId;
    const reference = `GW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const order: OrderRecord = {
      id,
      reference,
      userId: data.userId,
      email: data.email,
      phone: data.phone,
      shippingAddress: data.shippingAddress,
      totalCents: data.totalCents,
      status: "payment_pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.unshift(order);

    data.items.forEach(line => {
      const prod = this.products.find(p => p.id === line.productId);
      const vr = line.variantId ? this.variants.find(v => v.id === line.variantId) : undefined;
      const unitPriceCents = vr?.priceCents ?? prod?.basePriceCents ?? 0;
      this.orderItems.push({
        id: ++this.nextOrderItemId,
        orderId: id,
        productId: line.productId,
        variantId: line.variantId,
        itemName: prod?.name ?? "Gwave Item",
        unitPriceCents,
        quantity: line.quantity,
        selectedOptions: vr ? { size: vr.size, color: vr.color, label: vr.label } : null,
      });
      if (vr) {
        vr.stock = Math.max(0, vr.stock - line.quantity);
      }
    });

    return order;
  }

  reserveStock(userId: number, variantId: number, quantity: number) {
    const variant = this.variants.find(v => v.id === variantId);
    if (!variant || !variant.isActive || variant.stock < quantity) {
      return null;
    }
    variant.stock -= quantity;
    const expiresAt = new Date(Date.now() + STOCK_RESERVATION_TTL_MS);
    const reservationKey = `RSV-GW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    this.reservations.push({
      id: ++this.nextResId,
      reservationKey,
      userId,
      variantId,
      quantity,
      status: "active",
      expiresAt,
      createdAt: new Date(),
    });
    return { reservationKey, expiresAt };
  }

  releaseStock(userId: number, reservationKey: string) {
    const res = this.reservations.find(r => r.reservationKey === reservationKey && r.userId === userId && r.status === "active");
    if (!res) return false;
    res.status = "released";
    const variant = this.variants.find(v => v.id === res.variantId);
    if (variant) {
      variant.stock += res.quantity;
    }
    return true;
  }
}

export const memoryStore = new MemoryStore();

// Repository Functions
export async function getCatalogueProducts(input?: {
  category?: "seed" | "farm" | "merch";
  restricted?: boolean;
  query?: string;
  featured?: boolean;
}) {
  const db = await getDb();
  if (db) {
    try {
      const clauses = [eq(products.isPublished, true)];
      if (input?.category) clauses.push(eq(products.category, input.category));
      if (input?.restricted === true) clauses.push(eq(products.isRestricted, true));
      if (input?.featured === true) clauses.push(eq(products.isFeatured, true));
      if (input?.query?.trim()) clauses.push(like(products.name, `%${input.query.trim()}%`));
      if (!input?.restricted) clauses.push(eq(products.isRestricted, false));
      const res = await db.select().from(products).where(and(...clauses)).orderBy(desc(products.isFeatured), desc(products.createdAt));
      if (res && res.length > 0) return res;
    } catch (e) {
      console.warn("[Catalogue] DB query fallback to memory:", e);
    }
  }

  // Fallback to MemoryStore
  return memoryStore.products.filter(item => {
    if (!item.isPublished) return false;
    if (input?.restricted === true) {
      if (!item.isRestricted) return false;
    } else {
      if (item.isRestricted) return false;
    }
    if (input?.category && item.category !== input.category) return false;
    if (input?.featured === true && !item.isFeatured) return false;
    if (input?.query?.trim()) {
      const q = input.query.trim().toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export async function getProductDetail(productId: number) {
  const db = await getDb();
  if (db) {
    try {
      const p = await db.select().from(products).where(and(eq(products.id, productId), eq(products.isPublished, true))).limit(1);
      if (p.length > 0) {
        const variants = await db.select().from(productVariants).where(eq(productVariants.productId, productId));
        const images = await db.select().from(productImages).where(and(eq(productImages.productId, productId), eq(productImages.isPublished, true))).orderBy(productImages.sortOrder);
        return { product: p[0], variants: variants.filter(v => v.isActive), images };
      }
    } catch (e) {
      console.warn("[ProductDetail] DB query fallback to memory:", e);
    }
  }

  const product = memoryStore.products.find(p => p.id === productId && p.isPublished);
  if (!product) return null;
  const variants = memoryStore.variants.filter(v => v.productId === productId && v.isActive);
  const images = memoryStore.images.filter(img => img.productId === productId && img.isPublished);
  return { product, variants, images };
}

export async function getProductVariants(productId: number) {
  const db = await getDb();
  if (db) {
    try {
      const p = await db.select().from(products).where(eq(products.id, productId)).limit(1);
      if (p[0] && p[0].isPublished) {
        return db.select().from(productVariants).where(eq(productVariants.productId, productId));
      }
    } catch (e) {
      console.warn("[Variants] DB fallback to memory:", e);
    }
  }
  return memoryStore.variants.filter(v => v.productId === productId && v.isActive);
}

export async function getProductImages(productId: number) {
  const db = await getDb();
  if (db) {
    try {
      return db.select().from(productImages).where(and(eq(productImages.productId, productId), eq(productImages.isPublished, true))).orderBy(productImages.sortOrder);
    } catch (e) {
      console.warn("[Images] DB fallback to memory:", e);
    }
  }
  return memoryStore.images.filter(img => img.productId === productId && img.isPublished);
}

export async function getKnowledgeStrains(input?: {
  query?: string;
  thcMin?: number;
  thcMax?: number;
  cbdMin?: number;
  cbdMax?: number;
  effect?: (typeof EFFECT_TAGS)[number];
}) {
  const db = await getDb();
  if (db) {
    try {
      const clauses = [eq(strains.isPublished, true)];
      if (input?.query?.trim()) clauses.push(like(strains.name, `%${input.query.trim()}%`));
      if (input?.thcMin !== undefined) clauses.push(gte(strains.thcMaxPercent, input.thcMin.toFixed(2)));
      if (input?.thcMax !== undefined) clauses.push(lte(strains.thcMinPercent, input.thcMax.toFixed(2)));
      if (input?.cbdMin !== undefined) clauses.push(gte(strains.cbdMaxPercent, input.cbdMin.toFixed(2)));
      if (input?.cbdMax !== undefined) clauses.push(lte(strains.cbdMinPercent, input.cbdMax.toFixed(2)));
      const records = await db.select().from(strains).where(and(...clauses)).orderBy(desc(strains.updatedAt));
      if (records && records.length > 0) {
        return records.filter(record => matchesStrainProfileFilters(record, input ?? {}));
      }
    } catch (e) {
      console.warn("[Knowledge] DB fallback to memory:", e);
    }
  }

  // Fallback to MemoryStore
  return memoryStore.strains.filter(strain => {
    if (!strain.isPublished) return false;
    if (input?.query?.trim()) {
      const q = input.query.trim().toLowerCase();
      if (!strain.name.toLowerCase().includes(q) && !strain.classification.toLowerCase().includes(q) && !strain.verifiedFacts.toLowerCase().includes(q)) {
        return false;
      }
    }
    const thcMin = strain.thcMinPercent ? parseFloat(strain.thcMinPercent) : 0;
    const thcMax = strain.thcMaxPercent ? parseFloat(strain.thcMaxPercent) : 100;
    const cbdMin = strain.cbdMinPercent ? parseFloat(strain.cbdMinPercent) : 0;
    const cbdMax = strain.cbdMaxPercent ? parseFloat(strain.cbdMaxPercent) : 100;

    if (input?.thcMin !== undefined && thcMax < input.thcMin) return false;
    if (input?.thcMax !== undefined && thcMin > input.thcMax) return false;
    if (input?.cbdMin !== undefined && cbdMax < input.cbdMin) return false;
    if (input?.cbdMax !== undefined && cbdMin > input.cbdMax) return false;
    if (input?.effect) {
      if (!strain.effectTags || !strain.effectTags.includes(input.effect)) return false;
    }
    return true;
  });
}

export async function getStrainDetail(slug: string) {
  const db = await getDb();
  if (db) {
    try {
      const item = await db.select().from(strains).where(and(eq(strains.slug, slug), eq(strains.isPublished, true))).limit(1);
      if (item[0]) {
        const coa = await db.select({
          labName: coaReports.labName,
          reportNumber: coaReports.reportNumber,
          batchLot: coaReports.batchLot,
          testedAt: coaReports.testedAt,
          cannabinoidResults: coaReports.cannabinoidResults,
          terpeneSummary: coaReports.terpeneSummary,
          sourceReference: coaReports.sourceReference,
          reviewedAt: coaReports.reviewedAt,
        }).from(coaReports).where(and(eq(coaReports.strainId, item[0].id), eq(coaReports.status, "approved"))).orderBy(desc(coaReports.reviewedAt)).limit(1);
        return { record: item[0], coa: coa[0] ?? null };
      }
    } catch (e) {
      console.warn("[StrainDetail] DB fallback to memory:", e);
    }
  }

  const record = memoryStore.strains.find(s => s.slug === slug && s.isPublished);
  if (!record) return null;
  const coa = memoryStore.coas.find(c => c.strainId === record.id && c.status === "approved") ?? null;
  return {
    record,
    coa: coa ? {
      labName: coa.labName,
      reportNumber: coa.reportNumber,
      batchLot: coa.batchLot,
      testedAt: coa.testedAt,
      cannabinoidResults: coa.cannabinoidResults,
      terpeneSummary: coa.terpeneSummary,
      sourceReference: coa.sourceReference,
      reviewedAt: coa.reviewedAt,
    } : null,
  };
}

export async function getPublishedNews() {
  const db = await getDb();
  if (db) {
    try {
      const posts = await db.select().from(newsPosts).where(eq(newsPosts.status, "published")).orderBy(desc(newsPosts.publishedAt));
      if (posts && posts.length > 0) return posts;
    } catch (e) {
      console.warn("[News] DB fallback to memory:", e);
    }
  }
  return memoryStore.posts.filter(p => p.status === "published");
}
