export const ORDER_STATUSES = [
  "payment_pending",
  "payment_under_review",
  "approved_for_fulfilment",
  "packing",
  "shipped",
  "completed",
  "cancelled",
  "refund_pending",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

const orderTransitions: Record<OrderStatus, readonly OrderStatus[]> = {
  payment_pending: ["payment_under_review", "cancelled"],
  payment_under_review: ["approved_for_fulfilment", "refund_pending", "cancelled"],
  approved_for_fulfilment: ["packing", "cancelled"],
  packing: ["shipped", "cancelled"],
  shipped: ["completed", "refund_pending"],
  completed: ["refund_pending"],
  cancelled: [],
  refund_pending: ["cancelled"],
};

export const POST_STATUSES = ["draft", "review", "approved", "published"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

const postTransitions: Record<PostStatus, readonly PostStatus[]> = {
  draft: ["review"],
  review: ["draft", "approved"],
  approved: ["draft", "published"],
  published: ["draft"],
};

export function canTransitionOrder(current: OrderStatus, next: OrderStatus) {
  return orderTransitions[current].includes(next);
}

export function canTransitionPost(current: PostStatus, next: PostStatus) {
  return postTransitions[current].includes(next);
}

export const COA_STATUSES = ["draft", "review", "approved", "rejected"] as const;
export type CoaStatus = (typeof COA_STATUSES)[number];

const coaTransitions: Record<CoaStatus, readonly CoaStatus[]> = {
  draft: ["review"],
  review: ["approved", "rejected"],
  approved: ["rejected"],
  rejected: ["draft"],
};

export function canTransitionCoa(current: CoaStatus, next: CoaStatus) {
  return coaTransitions[current].includes(next);
}

export function isAllowedSlipUpload(contentType: string, bytes: number) {
  return ["image/jpeg", "image/png", "image/webp"].includes(contentType) && bytes > 0 && bytes <= 5 * 1024 * 1024;
}

export const EFFECT_TAGS = ["uplifting", "calming", "focused", "creative", "relaxing", "balanced"] as const;
export type EffectTag = (typeof EFFECT_TAGS)[number];

export type StrainProfileFilter = {
  thcMin?: number;
  thcMax?: number;
  cbdMin?: number;
  cbdMax?: number;
  effect?: EffectTag;
};

export type StrainProfileRecord = {
  thcMinPercent?: string | number | null;
  thcMaxPercent?: string | number | null;
  cbdMinPercent?: string | number | null;
  cbdMaxPercent?: string | number | null;
  effectTags?: string[] | null;
  cannabinoidSource?: string | null;
  effectSource?: string | null;
  profileReviewedAt?: Date | string | null;
};

function overlaps(recordMin: string | number | null | undefined, recordMax: string | number | null | undefined, filterMin?: number, filterMax?: number) {
  if (filterMin === undefined && filterMax === undefined) return true;
  if (!recordMin || !recordMax) return false;
  const min = Number(recordMin);
  const max = Number(recordMax);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return false;
  return (filterMin === undefined || max >= filterMin) && (filterMax === undefined || min <= filterMax);
}

export function matchesStrainProfileFilters(record: StrainProfileRecord, filters: StrainProfileFilter) {
  const usesCannabinoidFilter = filters.thcMin !== undefined || filters.thcMax !== undefined || filters.cbdMin !== undefined || filters.cbdMax !== undefined;
  const usesEffectFilter = filters.effect !== undefined;
  if ((usesCannabinoidFilter || usesEffectFilter) && !record.profileReviewedAt) return false;
  if (usesCannabinoidFilter && !record.cannabinoidSource) return false;
  if (!overlaps(record.thcMinPercent, record.thcMaxPercent, filters.thcMin, filters.thcMax)) return false;
  if (!overlaps(record.cbdMinPercent, record.cbdMaxPercent, filters.cbdMin, filters.cbdMax)) return false;
  if (filters.effect && (!record.effectSource || !record.effectTags?.includes(filters.effect))) return false;
  return true;
}
