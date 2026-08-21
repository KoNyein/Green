import { boolean, decimal, int, json, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { ORDER_STATUSES, POST_STATUSES } from "../server/gwave-workflows";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "staff", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const ageAcknowledgements = mysqlTable("ageAcknowledgements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  policyVersion: varchar("policyVersion", { length: 40 }).notNull(),
  acceptedAt: timestamp("acceptedAt").defaultNow().notNull(),
}, table => [uniqueIndex("age_acknowledgement_user_unique").on(table.userId)]);

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 180 }).notNull(),
  category: mysqlEnum("category", ["seed", "farm", "merch"]).notNull(),
  isRestricted: boolean("isRestricted").default(false).notNull(),
  description: text("description").notNull(),
  highlights: json("highlights").$type<string[]>().notNull(),
  sizeChart: text("sizeChart"),
  basePriceCents: int("basePriceCents").notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isPublished: boolean("isPublished").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const productVariants = mysqlTable("productVariants", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  sku: varchar("sku", { length: 80 }).notNull().unique(),
  label: varchar("label", { length: 100 }).notNull(),
  size: varchar("size", { length: 40 }),
  color: varchar("color", { length: 60 }),
  priceCents: int("priceCents").notNull(),
  stock: int("stock").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const productImages = mysqlTable("productImages", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  storageUrl: varchar("storageUrl", { length: 700 }).notNull(),
  altText: varchar("altText", { length: 220 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const stockReservations = mysqlTable("stockReservations", {
  id: int("id").autoincrement().primaryKey(),
  reservationKey: varchar("reservationKey", { length: 64 }).notNull().unique(),
  userId: int("userId").notNull(),
  variantId: int("variantId").notNull(),
  quantity: int("quantity").notNull(),
  status: mysqlEnum("status", ["active", "released", "consumed", "expired"]).default("active").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const strains = mysqlTable("strains", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId"),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 180 }).notNull(),
  classification: varchar("classification", { length: 100 }).notNull(),
  verifiedFacts: text("verifiedFacts").notNull(),
  supplierDescription: text("supplierDescription").notNull(),
  educationalNote: text("educationalNote").notNull(),
  legalNotice: text("legalNotice").notNull(),
  thcMinPercent: decimal("thcMinPercent", { precision: 5, scale: 2 }),
  thcMaxPercent: decimal("thcMaxPercent", { precision: 5, scale: 2 }),
  cbdMinPercent: decimal("cbdMinPercent", { precision: 5, scale: 2 }),
  cbdMaxPercent: decimal("cbdMaxPercent", { precision: 5, scale: 2 }),
  effectTags: json("effectTags").$type<string[]>(),
  cannabinoidSource: varchar("cannabinoidSource", { length: 500 }),
  effectSource: varchar("effectSource", { length: 500 }),
  profileReviewedAt: timestamp("profileReviewedAt"),
  isPublished: boolean("isPublished").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const coaReports = mysqlTable("coaReports", {
  id: int("id").autoincrement().primaryKey(),
  strainId: int("strainId").notNull(),
  labName: varchar("labName", { length: 180 }).notNull(),
  reportNumber: varchar("reportNumber", { length: 120 }).notNull(),
  batchLot: varchar("batchLot", { length: 120 }),
  testedAt: timestamp("testedAt"),
  cannabinoidResults: json("cannabinoidResults").$type<Record<string, string>>().notNull(),
  terpeneSummary: json("terpeneSummary").$type<Record<string, string>>().notNull(),
  sourceReference: varchar("sourceReference", { length: 500 }).notNull(),
  privateDocumentKey: varchar("privateDocumentKey", { length: 500 }),
  status: mysqlEnum("status", ["draft", "review", "approved", "rejected"]).default("draft").notNull(),
  reviewedBy: int("reviewedBy"),
  reviewedAt: timestamp("reviewedAt"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const newsPosts = mysqlTable("newsPosts", {
  id: int("id").autoincrement().primaryKey(),
  category: mysqlEnum("category", ["gwave_news", "new_arrivals", "knowledge", "promotion", "legal_safety"]).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  status: mysqlEnum("status", POST_STATUSES).default("draft").notNull(),
  authorId: int("authorId").notNull(),
  reviewerId: int("reviewerId"),
  approvedBy: int("approvedBy"),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  reference: varchar("reference", { length: 40 }).notNull().unique(),
  userId: int("userId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  shippingAddress: text("shippingAddress").notNull(),
  totalCents: int("totalCents").notNull(),
  status: mysqlEnum("status", ORDER_STATUSES).default("payment_pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  variantId: int("variantId"),
  itemName: varchar("itemName", { length: 180 }).notNull(),
  unitPriceCents: int("unitPriceCents").notNull(),
  quantity: int("quantity").notNull(),
  selectedOptions: json("selectedOptions").$type<Record<string, string>>(),
});

export const paymentSlips = mysqlTable("paymentSlips", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  storageKey: varchar("storageKey", { length: 500 }).notNull().unique(),
  contentType: varchar("contentType", { length: 100 }).notNull(),
  originalFilename: varchar("originalFilename", { length: 160 }).notNull(),
  uploadedBy: int("uploadedBy").notNull(),
  status: mysqlEnum("status", ["pending", "verified", "rejected", "expired"]).default("pending").notNull(),
  expiresAt: timestamp("expiresAt"),
  reviewedBy: int("reviewedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const paymentSlipAccessAudits = mysqlTable("paymentSlipAccessAudits", {
  id: int("id").autoincrement().primaryKey(),
  paymentSlipId: int("paymentSlipId").notNull(),
  actorId: int("actorId").notNull(),
  action: mysqlEnum("action", ["uploaded", "opened", "expired"]).notNull(),
  detail: varchar("detail", { length: 300 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const orderStatusAudits = mysqlTable("orderStatusAudits", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  previousStatus: mysqlEnum("previousStatus", ORDER_STATUSES),
  nextStatus: mysqlEnum("nextStatus", ORDER_STATUSES).notNull(),
  actorId: int("actorId").notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  orderReference: varchar("orderReference", { length: 40 }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["open", "closed"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
