import {
  COA_STATUSES,
  EFFECT_TAGS,
  ORDER_STATUSES,
  POST_STATUSES,
} from "./gwave-workflows";

export interface ProductItem {
  id: number;
  slug: string;
  name: string;
  category: "seed" | "farm" | "merch";
  isRestricted: boolean;
  description: string;
  highlights: string[];
  sizeChart: string | null;
  basePriceCents: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VariantItem {
  id: number;
  productId: number;
  sku: string;
  label: string;
  size: string | null;
  color: string | null;
  priceCents: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
}

export interface ImageItem {
  id: number;
  productId: number;
  storageUrl: string;
  altText: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
}

export interface StrainItem {
  id: number;
  productId: number | null;
  slug: string;
  name: string;
  classification: string;
  verifiedFacts: string;
  supplierDescription: string;
  educationalNote: string;
  legalNotice: string;
  thcMinPercent: string | null;
  thcMaxPercent: string | null;
  cbdMinPercent: string | null;
  cbdMaxPercent: string | null;
  effectTags: string[] | null;
  cannabinoidSource: string | null;
  effectSource: string | null;
  profileReviewedAt: Date | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoaReportItem {
  id: number;
  strainId: number;
  labName: string;
  reportNumber: string;
  batchLot: string | null;
  testedAt: Date | null;
  cannabinoidResults: Record<string, string>;
  terpeneSummary: Record<string, string>;
  sourceReference: string;
  privateDocumentKey: string | null;
  status: (typeof COA_STATUSES)[number];
  reviewedBy: number | null;
  reviewedAt: Date | null;
  createdBy: number;
  createdAt: Date;
}

export interface NewsPostItem {
  id: number;
  category: (typeof POST_STATUSES)[number] | "gwave_news" | "new_arrivals" | "knowledge" | "promotion" | "legal_safety";
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status: (typeof POST_STATUSES)[number];
  authorId: number;
  reviewerId: number | null;
  approvedBy: number | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderRecord {
  id: number;
  reference: string;
  userId: number;
  email: string;
  phone: string;
  shippingAddress: string;
  totalCents: number;
  status: (typeof ORDER_STATUSES)[number];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemRecord {
  id: number;
  orderId: number;
  productId: number;
  variantId: number | null;
  itemName: string;
  unitPriceCents: number;
  quantity: number;
  selectedOptions: Record<string, unknown> | null;
}

export interface PaymentSlipRecord {
  id: number;
  orderId: number;
  storageKey: string;
  contentType: "image/jpeg" | "image/png" | "image/webp";
  originalFilename: string;
  uploadedBy: number;
  status: "pending" | "approved" | "rejected" | "expired";
  expiresAt: Date | null;
  createdAt: Date;
}

// Initial Seed Products
export const SEED_PRODUCTS: ProductItem[] = [
  {
    id: 1,
    slug: "gwave-heavyweight-tactical-hoodie",
    name: "Gwave Heavyweight Tactical Hoodie",
    category: "merch",
    isRestricted: false,
    description: "Built from dense 480 GSM organic french terry with magnetic storm collar and reinforced ergonomic paneling. Engineered for urban utility and weather resistance.",
    highlights: [
      "480 GSM dense french terry organic cotton",
      "Hidden magnetic storm hood closure",
      "Tactical zip sleeve pocket with industrial pull tab",
      "Double-reinforced elbow and shoulder panels",
    ],
    sizeChart: "S: Chest 42\" / Length 27\"\nM: Chest 44\" / Length 28\"\nL: Chest 46\" / Length 29\"\nXL: Chest 48\" / Length 30\"\nXXL: Chest 50\" / Length 31\"",
    basePriceCents: 8500,
    isFeatured: true,
    isPublished: true,
    createdAt: new Date("2026-08-01T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 2,
    slug: "gwave-modular-utility-vest",
    name: "Gwave Modular Utility Vest",
    category: "merch",
    isRestricted: false,
    description: "Tear-resistant 1000D Cordura construction with laser-cut MOLLE webbing and weather-sealed dual zip compartments. Designed for gear carry and modular field setups.",
    highlights: [
      "1000D Cordura ballistic nylon weave",
      "Modular laser-cut MOLLE attachment matrix",
      "YKK AquaGuard weatherproof zippers",
      "Adjustable tactical side cinch harness",
    ],
    sizeChart: "M: Chest 38-42\" (Adjustable)\nL: Chest 42-46\" (Adjustable)\nXL: Chest 46-50\" (Adjustable)",
    basePriceCents: 11000,
    isFeatured: true,
    isPublished: true,
    createdAt: new Date("2026-08-02T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 3,
    slug: "gwave-industrial-heavyweight-tee",
    name: "Gwave Industrial Oversized Tee",
    category: "merch",
    isRestricted: false,
    description: "Heavy 260 GSM combed cotton jersey in a boxy streetwear cut, featuring the high-contrast Gwave Brand Signal graphic and technical spec markings.",
    highlights: [
      "260 GSM combed long-staple cotton",
      "High-density screenprint on back & chest crest",
      "Reinforced ribbed collar that never loses shape",
      "Pre-shrunk reactive dyed fabric",
    ],
    sizeChart: "S: Chest 40\" / Length 28\"\nM: Chest 43\" / Length 29\"\nL: Chest 46\" / Length 30\"\nXL: Chest 49\" / Length 31\"",
    basePriceCents: 4200,
    isFeatured: true,
    isPublished: true,
    createdAt: new Date("2026-08-03T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 4,
    slug: "gwave-precision-grinder-aluminum",
    name: "Gwave 4-Piece CNC Precision Grinder",
    category: "merch",
    isRestricted: false,
    description: "CNC machined from 6061-T6 aerospace aluminum with diamond-curved cutting teeth, stainless micron sifting mesh, and rare-earth neodymium magnetic seal.",
    highlights: [
      "6061-T6 aerospace anodized aluminum",
      "Curved diamond cutting teeth for maximum fluff",
      "Ultra-fine stainless pollen sifter screen",
      "Teflon glide ring for zero-friction turning",
    ],
    sizeChart: "Diameter: 63mm (2.5 inches)\nHeight: 48mm (1.9 inches)\nWeight: 175g",
    basePriceCents: 4800,
    isFeatured: false,
    isPublished: true,
    createdAt: new Date("2026-08-04T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 5,
    slug: "gwave-carbon-vault-smell-proof-bag",
    name: "Gwave Carbon Lock Vault Bag",
    category: "merch",
    isRestricted: false,
    description: "8-layer activated carbon odor-trapping lining with integrated 3-digit combination lock and weatherproof exterior shell.",
    highlights: [
      "8-layer activated carbon odor neutralization",
      "Built-in TSA security combination lock",
      "Waterproof 600D ballistic nylon exterior",
      "Customizable padded interior dividers",
    ],
    sizeChart: "Medium 3L: 8.5\" x 6\" x 4\"\nLarge 7L: 11\" x 8\" x 5.5\"",
    basePriceCents: 5800,
    isFeatured: false,
    isPublished: true,
    createdAt: new Date("2026-08-05T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 6,
    slug: "gwave-industrial-canvas-tote",
    name: "Gwave Industrial Canvas Carry Tote",
    category: "merch",
    isRestricted: false,
    description: "Heavyweight 16oz duck canvas tote with reinforced tactical webbing handles, internal zip stash pocket, and industrial brand spec print.",
    highlights: [
      "16oz heavy duty cotton duck canvas",
      "Box-stitched reinforced mil-spec nylon webbing",
      "Internal zipper stash pocket & carabiner key ring",
    ],
    sizeChart: "Width: 18\" / Height: 15\" / Depth: 6\" / Handle Drop: 10\"",
    basePriceCents: 3200,
    isFeatured: false,
    isPublished: true,
    createdAt: new Date("2026-08-06T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 7,
    slug: "gwave-heritage-f1-auto-seeds",
    name: "Gwave Heritage F1 Auto-Fem Seed Pack",
    category: "seed",
    isRestricted: true,
    description: "Stabilized 5th generation autoflowering feminized genetics with vigorous germination rates, rich terpene expressions, and exceptional resilience.",
    highlights: [
      "Gen 5 stabilized F1 autoflowering genetics",
      "Vigorously lab-tested germination rate >98%",
      "High natural pest and mold resistance",
      "Controlled sealed breeder batch with hologram seal",
    ],
    sizeChart: "3-Seed Souvenir Pack / 5-Seed Pack / 10-Seed Breeder Tin",
    basePriceCents: 6500,
    isFeatured: true,
    isPublished: true,
    createdAt: new Date("2026-08-07T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 8,
    slug: "northern-high-altitude-fem-seeds",
    name: "Northern High-Altitude Feminized Seeds",
    category: "seed",
    isRestricted: true,
    description: "Cold-tolerant mountainous feminized photoperiod variety with dense trichome coverage and a fast 8-9 week flowering period.",
    highlights: [
      "Bred for temperature fluctuation tolerance",
      "Compact internodal spacing with heavy resin output",
      "Fast 8-9 week photoperiod flowering window",
    ],
    sizeChart: "3-Seed Pack / 5-Seed Pack / 10-Seed Pack",
    basePriceCents: 7200,
    isFeatured: false,
    isPublished: true,
    createdAt: new Date("2026-08-08T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 9,
    slug: "gwave-bioactive-botanical-feed",
    name: "Gwave Bio-Active Botanical Micronutrient Feed",
    category: "farm",
    isRestricted: true,
    description: "Chelated botanical liquid feed enriched with fulvic acid, seaweed extract, and trace minerals for robust plant vigor and terpene richness.",
    highlights: [
      "Cold-processed organic marine kelp & fulvic acids",
      "Complete chelated micro & macro mineral array",
      "Compatible with soil, coco, and hydroponic systems",
    ],
    sizeChart: "1 Liter Bottle / 5 Liter Professional Jug",
    basePriceCents: 3800,
    isFeatured: false,
    isPublished: true,
    createdAt: new Date("2026-08-09T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 10,
    slug: "precision-titanium-trimming-shears",
    name: "Gwave Precision Curved Titanium Shears",
    category: "farm",
    isRestricted: true,
    description: "Japanese surgical stainless steel blades with non-stick fluoropolymer coating, high-rebound spring, and ergonomic grip for precision harvesting.",
    highlights: [
      "Fluorine non-stick resin-resistant coating",
      "Curved blade tips for ultra-close surgical trimming",
      "Ergonomic shock-absorbing TPR comfort grip",
    ],
    sizeChart: "Length: 6.5 inches / Weight: 68g",
    basePriceCents: 2400,
    isFeatured: false,
    isPublished: true,
    createdAt: new Date("2026-08-10T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
];

// Initial Seed Product Variants
export const SEED_VARIANTS: VariantItem[] = [
  // Product 1 - Tactical Hoodie
  { id: 1, productId: 1, sku: "GW-HD-BLK-S", label: "Small", size: "S", color: "Stealth Black", priceCents: 8500, stock: 14, isActive: true, createdAt: new Date() },
  { id: 2, productId: 1, sku: "GW-HD-BLK-M", label: "Medium", size: "M", color: "Stealth Black", priceCents: 8500, stock: 28, isActive: true, createdAt: new Date() },
  { id: 3, productId: 1, sku: "GW-HD-BLK-L", label: "Large", size: "L", color: "Stealth Black", priceCents: 8500, stock: 35, isActive: true, createdAt: new Date() },
  { id: 4, productId: 1, sku: "GW-HD-BLK-XL", label: "Extra Large", size: "XL", color: "Stealth Black", priceCents: 8500, stock: 22, isActive: true, createdAt: new Date() },
  { id: 5, productId: 1, sku: "GW-HD-BLK-XXL", label: "2X Large", size: "XXL", color: "Stealth Black", priceCents: 8900, stock: 10, isActive: true, createdAt: new Date() },

  // Product 2 - Modular Vest
  { id: 6, productId: 2, sku: "GW-VST-BLK-M", label: "Medium", size: "M", color: "Stealth Black", priceCents: 11000, stock: 15, isActive: true, createdAt: new Date() },
  { id: 7, productId: 2, sku: "GW-VST-BLK-L", label: "Large", size: "L", color: "Stealth Black", priceCents: 11000, stock: 18, isActive: true, createdAt: new Date() },
  { id: 8, productId: 2, sku: "GW-VST-OLV-L", label: "Large", size: "L", color: "Military Olive", priceCents: 11000, stock: 12, isActive: true, createdAt: new Date() },

  // Product 3 - Oversized Tee
  { id: 9, productId: 3, sku: "GW-TEE-BLK-S", label: "Small", size: "S", color: "Pitch Black", priceCents: 4200, stock: 25, isActive: true, createdAt: new Date() },
  { id: 10, productId: 3, sku: "GW-TEE-BLK-M", label: "Medium", size: "M", color: "Pitch Black", priceCents: 4200, stock: 40, isActive: true, createdAt: new Date() },
  { id: 11, productId: 3, sku: "GW-TEE-BLK-L", label: "Large", size: "L", color: "Pitch Black", priceCents: 4200, stock: 45, isActive: true, createdAt: new Date() },
  { id: 12, productId: 3, sku: "GW-TEE-BLK-XL", label: "Extra Large", size: "XL", color: "Pitch Black", priceCents: 4200, stock: 20, isActive: true, createdAt: new Date() },

  // Product 4 - Grinder
  { id: 13, productId: 4, sku: "GW-GRN-BLK-63", label: "Matte Black (63mm)", size: "63mm", color: "Matte Black", priceCents: 4800, stock: 35, isActive: true, createdAt: new Date() },
  { id: 14, productId: 4, sku: "GW-GRN-GUN-63", label: "Gunmetal (63mm)", size: "63mm", color: "Raw Gunmetal", priceCents: 4800, stock: 25, isActive: true, createdAt: new Date() },

  // Product 5 - Vault Bag
  { id: 15, productId: 5, sku: "GW-VLT-MED-3L", label: "3-Liter Medium", size: "3L", color: "Stealth Black", priceCents: 5800, stock: 30, isActive: true, createdAt: new Date() },
  { id: 16, productId: 5, sku: "GW-VLT-LRG-7L", label: "7-Liter Large", size: "7L", color: "Stealth Black", priceCents: 7500, stock: 18, isActive: true, createdAt: new Date() },

  // Product 6 - Canvas Tote
  { id: 17, productId: 6, sku: "GW-TOT-RAW-OS", label: "One Size", size: "OS", color: "Raw Canvas", priceCents: 3200, stock: 50, isActive: true, createdAt: new Date() },

  // Product 7 - Heritage Seeds
  { id: 18, productId: 7, sku: "GW-SED-HRT-3PK", label: "3-Seed Souvenir Pack", size: "3-Pack", color: "Collector Tin", priceCents: 6500, stock: 40, isActive: true, createdAt: new Date() },
  { id: 19, productId: 7, sku: "GW-SED-HRT-5PK", label: "5-Seed Souvenir Pack", size: "5-Pack", color: "Collector Tin", priceCents: 9800, stock: 30, isActive: true, createdAt: new Date() },

  // Product 8 - Northern High-Altitude
  { id: 20, productId: 8, sku: "GW-SED-NTH-3PK", label: "3-Seed Souvenir Pack", size: "3-Pack", color: "Collector Tin", priceCents: 7200, stock: 25, isActive: true, createdAt: new Date() },
  { id: 21, productId: 8, sku: "GW-SED-NTH-5PK", label: "5-Seed Souvenir Pack", size: "5-Pack", color: "Collector Tin", priceCents: 11000, stock: 20, isActive: true, createdAt: new Date() },

  // Product 9 - Botanical Feed
  { id: 22, productId: 9, sku: "GW-FED-BIO-1L", label: "1 Liter Bottle", size: "1L", color: "Bottle", priceCents: 3800, stock: 60, isActive: true, createdAt: new Date() },
  { id: 23, productId: 9, sku: "GW-FED-BIO-5L", label: "5 Liter Jug", size: "5L", color: "Jug", priceCents: 14500, stock: 20, isActive: true, createdAt: new Date() },

  // Product 10 - Shears
  { id: 24, productId: 10, sku: "GW-SHR-TIT-1PK", label: "Standard Pair", size: "6.5 Inch", color: "Black Titanium", priceCents: 2400, stock: 75, isActive: true, createdAt: new Date() },
];

// Initial Seed Product Images
export const SEED_IMAGES: ImageItem[] = [
  { id: 1, productId: 1, storageUrl: "/manus-storage/gwave-brand-signal-apparel_98432144.jpg", altText: "Gwave Heavyweight Tactical Hoodie Front View", sortOrder: 0, isPublished: true, createdAt: new Date() },
  { id: 2, productId: 2, storageUrl: "/manus-storage/gwave-brand-signal-utility_1a27983b.jpg", altText: "Gwave Modular Utility Vest Detail", sortOrder: 0, isPublished: true, createdAt: new Date() },
  { id: 3, productId: 3, storageUrl: "/manus-storage/gwave-brand-signal-apparel_98432144.jpg", altText: "Gwave Industrial Oversized Tee Fit", sortOrder: 0, isPublished: true, createdAt: new Date() },
  { id: 4, productId: 4, storageUrl: "/manus-storage/gwave-brand-signal-utility_1a27983b.jpg", altText: "Gwave Precision 4-Piece Grinder", sortOrder: 0, isPublished: true, createdAt: new Date() },
  { id: 5, productId: 5, storageUrl: "/manus-storage/gwave-brand-signal-utility_1a27983b.jpg", altText: "Gwave Carbon Vault Smell-Proof Bag", sortOrder: 0, isPublished: true, createdAt: new Date() },
  { id: 6, productId: 6, storageUrl: "/manus-storage/gwave-brand-signal-apparel_98432144.jpg", altText: "Gwave Industrial Canvas Carry Tote", sortOrder: 0, isPublished: true, createdAt: new Date() },
  { id: 7, productId: 7, storageUrl: "/manus-storage/gwave-social-square_d80b84a5.jpg", altText: "Gwave Heritage F1 Seeds Tin", sortOrder: 0, isPublished: true, createdAt: new Date() },
  { id: 8, productId: 8, storageUrl: "/manus-storage/gwave-social-square_d80b84a5.jpg", altText: "Northern High-Altitude Seeds", sortOrder: 0, isPublished: true, createdAt: new Date() },
  { id: 9, productId: 9, storageUrl: "/manus-storage/gwave-brand-signal-utility_1a27983b.jpg", altText: "Gwave Bioactive Botanical Feed", sortOrder: 0, isPublished: true, createdAt: new Date() },
  { id: 10, productId: 10, storageUrl: "/manus-storage/gwave-brand-signal-utility_1a27983b.jpg", altText: "Gwave Precision Titanium Shears", sortOrder: 0, isPublished: true, createdAt: new Date() },
];

// Initial Seed Strains (Rich strain data library)
export const SEED_STRAINS: StrainItem[] = [
  {
    id: 1,
    productId: null,
    slug: "gwave-reserve-01",
    name: "Gwave Reserve 01",
    classification: "Hybrid",
    verifiedFacts: "A signature proprietary cross developed for balanced daytime clarity and rich terpene richness.",
    supplierDescription: "Gwave Reserve 01 combines pungent diesel aromatics with sweet pine and bright citrus overtones, delivering dense frosty flower structures.",
    educationalNote: "High beta-caryophyllene and limonene terpene concentration, tested rigorously across multiple harvest batches.",
    legalNotice: "For educational, botanical, and lawful reference in compliance with applicable regulations. 21+ only.",
    thcMinPercent: "24.50",
    thcMaxPercent: "27.20",
    cbdMinPercent: "0.10",
    cbdMaxPercent: "0.40",
    effectTags: ["focused", "uplifting", "creative"],
    cannabinoidSource: "Steep Hill Analytical Labs batch COA #GW-2026-B089",
    effectSource: "Gwave Botanical Lab Verified Sensory & Terpene Mapping Panel",
    profileReviewedAt: new Date("2026-08-15T00:00:00Z"),
    isPublished: true,
    createdAt: new Date("2026-08-01T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 2,
    productId: null,
    slug: "northern-lights",
    name: "Northern Lights",
    classification: "Indica",
    verifiedFacts: "Renowned legendary indica landrace hybrid with roots from the Pacific Northwest and Afghani lineage.",
    supplierDescription: "Classic spicy, sweet, and earthy pine aroma with dense crystalline resin coats and rich purple undertones.",
    educationalNote: "Predominant myrcene and pinene terpene composition, frequently studied for its deep bodily relaxation properties.",
    legalNotice: "Botanical reference only. Compliance with 21+ regulations required.",
    thcMinPercent: "18.00",
    thcMaxPercent: "21.50",
    cbdMinPercent: "0.10",
    cbdMaxPercent: "0.30",
    effectTags: ["relaxing", "calming"],
    cannabinoidSource: "SC Laboratories Certificate #SCL-2026-NL44",
    effectSource: "Verified Botanical Database Panel Review",
    profileReviewedAt: new Date("2026-08-14T00:00:00Z"),
    isPublished: true,
    createdAt: new Date("2026-08-02T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 3,
    productId: null,
    slug: "sour-diesel",
    name: "Sour Diesel",
    classification: "Sativa",
    verifiedFacts: "Top-tier East Coast sativa lineage celebrated since the early 1990s, crossing Chemdawg 91 and Super Skunk.",
    supplierDescription: "Pungent fuel aroma with zesty lemon and herbal notes, noted for invigorating sensory impact.",
    educationalNote: "High limonene, myrcene, and beta-caryophyllene terpene profile giving it its trademark sour gas scent.",
    legalNotice: "Educational knowledge profile.",
    thcMinPercent: "21.00",
    thcMaxPercent: "25.00",
    cbdMinPercent: "0.20",
    cbdMaxPercent: "0.50",
    effectTags: ["uplifting", "energizing", "focused"],
    cannabinoidSource: "Green Leaf Testing Facility Report #GLT-9021-SD",
    effectSource: "Gwave Verified Review Board",
    profileReviewedAt: new Date("2026-08-12T00:00:00Z"),
    isPublished: true,
    createdAt: new Date("2026-08-03T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 4,
    productId: null,
    slug: "og-kush",
    name: "OG Kush",
    classification: "Hybrid",
    verifiedFacts: "Foundational West Coast genetic pillar underpinning numerous modern varieties across North America and Europe.",
    supplierDescription: "Complex aroma of damp earth, pine woods, and sour citrus rind with potent resin trichome coverage.",
    educationalNote: "Myrcene, limonene, and beta-caryophyllene dominant profile with balanced head and body harmony.",
    legalNotice: "Reference data only.",
    thcMinPercent: "22.00",
    thcMaxPercent: "26.50",
    cbdMinPercent: "0.20",
    cbdMaxPercent: "0.40",
    effectTags: ["balanced", "relaxing", "calming"],
    cannabinoidSource: "Analytical Botanicals Lab #ABL-774-OG",
    effectSource: "Staff Agronomy Audit",
    profileReviewedAt: new Date("2026-08-10T00:00:00Z"),
    isPublished: true,
    createdAt: new Date("2026-08-04T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 5,
    productId: null,
    slug: "granddaddy-purple",
    name: "Granddaddy Purple",
    classification: "Indica",
    verifiedFacts: "Deep purple calyxes bred from Purple Urkle and Big Bud, known for dark violet hues and heavy resin output.",
    supplierDescription: "Sweet berry and fresh grape fruit fragrance with an earthy, flowery undertone.",
    educationalNote: "Rich in myrcene, pinene, and linalool terpenes.",
    legalNotice: "Standard educational botanical record.",
    thcMinPercent: "20.00",
    thcMaxPercent: "24.00",
    cbdMinPercent: "0.10",
    cbdMaxPercent: "0.30",
    effectTags: ["relaxing", "calming"],
    cannabinoidSource: "Steep Hill Lab COA #GDP-8812",
    effectSource: "Gwave Lab Sensory Review",
    profileReviewedAt: new Date("2026-08-11T00:00:00Z"),
    isPublished: true,
    createdAt: new Date("2026-08-05T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 6,
    productId: null,
    slug: "jack-herer",
    name: "Jack Herer",
    classification: "Sativa",
    verifiedFacts: "Bred in the Netherlands honoring the legendary cannabis activist and author, combining Haze, Northern Lights #5, and Shiva Skunk.",
    supplierDescription: "Spicy pine aroma with cracked black pepper, citrus peel, and crisp wood notes.",
    educationalNote: "High terpinolene and pinene content promoting an alert, cerebral sensory experience.",
    legalNotice: "Educational reference.",
    thcMinPercent: "19.50",
    thcMaxPercent: "23.50",
    cbdMinPercent: "0.10",
    cbdMaxPercent: "0.40",
    effectTags: ["creative", "focused", "uplifting"],
    cannabinoidSource: "ProVerde Analytical Report #PVA-6502",
    effectSource: "Agronomic Standards Panel",
    profileReviewedAt: new Date("2026-08-08T00:00:00Z"),
    isPublished: true,
    createdAt: new Date("2026-08-06T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 7,
    productId: null,
    slug: "blue-dream",
    name: "Blue Dream",
    classification: "Hybrid",
    verifiedFacts: "California hybrid crossing Blueberry with Haze, widely recognized for versatile aroma and approachable strength.",
    supplierDescription: "Sweet blueberry pie fragrance with herbal undertones and generous trichome blanket.",
    educationalNote: "Myrcene and pinene dominant terpene bouquet creating a mellow, harmonious profile.",
    legalNotice: "Educational record.",
    thcMinPercent: "17.50",
    thcMaxPercent: "22.00",
    cbdMinPercent: "0.50",
    cbdMaxPercent: "1.20",
    effectTags: ["balanced", "creative", "relaxing"],
    cannabinoidSource: "SC Labs Testing COA #BD-904",
    effectSource: "Gwave Botanical Review",
    profileReviewedAt: new Date("2026-08-09T00:00:00Z"),
    isPublished: true,
    createdAt: new Date("2026-08-07T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 8,
    productId: null,
    slug: "gelato-33",
    name: "Gelato 33 (Larry Bird)",
    classification: "Hybrid",
    verifiedFacts: "Sunset Sherbet crossed with Thin Mint GSC originating in the San Francisco Bay Area.",
    supplierDescription: "Sweet sherbet dessert aroma with creamy citrus, lavender, and earthy mint notes.",
    educationalNote: "High caryophyllene, limonene, and humulene providing distinct confectionery aromatics.",
    legalNotice: "Educational record.",
    thcMinPercent: "23.00",
    thcMaxPercent: "26.00",
    cbdMinPercent: "0.10",
    cbdMaxPercent: "0.30",
    effectTags: ["relaxing", "uplifting", "balanced"],
    cannabinoidSource: "Steep Hill Lab COA #G33-5110",
    effectSource: "Gwave Verified Review",
    profileReviewedAt: new Date("2026-08-16T00:00:00Z"),
    isPublished: true,
    createdAt: new Date("2026-08-08T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 9,
    productId: null,
    slug: "durban-poison",
    name: "Durban Poison",
    classification: "Sativa",
    verifiedFacts: "Pure South African landrace sativa celebrated worldwide for its clear, energetic, and productive profile.",
    supplierDescription: "Sweet anise, liquorice, and earthy pine aromatics with vibrant lime-green flowers.",
    educationalNote: "High in terpinolene and d-limonene, exceptionally clean finish with negligible sedative cannabinoids.",
    legalNotice: "Educational record.",
    thcMinPercent: "19.00",
    thcMaxPercent: "24.00",
    cbdMinPercent: "0.10",
    cbdMaxPercent: "0.20",
    effectTags: ["uplifting", "energizing", "creative"],
    cannabinoidSource: "Green Leaf Testing #DP-2026",
    effectSource: "Verified Panel Audit",
    profileReviewedAt: new Date("2026-08-13T00:00:00Z"),
    isPublished: true,
    createdAt: new Date("2026-08-09T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 10,
    productId: null,
    slug: "super-lemon-haze",
    name: "Super Lemon Haze",
    classification: "Sativa",
    verifiedFacts: "Multiple Cannabis Cup champion crossing Lemon Skunk with Super Silver Haze.",
    supplierDescription: "Tart, sweet, and zesty lemon candy aromatics with energetic brightness and dense resin spears.",
    educationalNote: "Dominant limonene and beta-caryophyllene imparting sharp, vibrant terpene nuances.",
    legalNotice: "Educational record.",
    thcMinPercent: "20.00",
    thcMaxPercent: "25.00",
    cbdMinPercent: "0.20",
    cbdMaxPercent: "0.50",
    effectTags: ["uplifting", "creative", "focused"],
    cannabinoidSource: "Analytical Botanical Labs #SLH-439",
    effectSource: "Gwave Botanical Panel",
    profileReviewedAt: new Date("2026-08-14T00:00:00Z"),
    isPublished: true,
    createdAt: new Date("2026-08-10T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
];

// Initial Seed COA Reports
export const SEED_COAS: CoaReportItem[] = [
  {
    id: 1,
    strainId: 1,
    labName: "Steep Hill Analytical Labs",
    reportNumber: "COA-GW-2026-089B",
    batchLot: "LOT-GW26-01A",
    testedAt: new Date("2026-08-14T00:00:00Z"),
    cannabinoidResults: {
      "THCA": "26.4%",
      "d9-THC": "0.8%",
      "CBDA": "0.15%",
      "CBD": "0.08%",
      "CBG": "1.2%",
      "CBN": "<0.01%",
      "Total Cannabinoids": "28.63%",
    },
    terpeneSummary: {
      "beta-Myrcene": "1.42%",
      "d-Limonene": "0.88%",
      "beta-Caryophyllene": "0.64%",
      "alpha-Pinene": "0.32%",
      "Linalool": "0.21%",
      "Total Terpenes": "3.47%",
    },
    sourceReference: "https://gwave.market/verify/COA-GW-2026-089B",
    privateDocumentKey: null,
    status: "approved",
    reviewedBy: 1,
    reviewedAt: new Date("2026-08-15T00:00:00Z"),
    createdBy: 1,
    createdAt: new Date("2026-08-14T00:00:00Z"),
  },
  {
    id: 2,
    strainId: 2,
    labName: "SC Laboratories",
    reportNumber: "COA-SCL-2026-NL44",
    batchLot: "LOT-NL-2608",
    testedAt: new Date("2026-08-13T00:00:00Z"),
    cannabinoidResults: {
      "THCA": "20.8%",
      "d9-THC": "0.6%",
      "CBD": "0.12%",
      "CBG": "0.75%",
      "Total Cannabinoids": "22.27%",
    },
    terpeneSummary: {
      "beta-Myrcene": "1.85%",
      "beta-Pinene": "0.55%",
      "beta-Caryophyllene": "0.42%",
      "Total Terpenes": "2.82%",
    },
    sourceReference: "https://gwave.market/verify/COA-SCL-2026-NL44",
    privateDocumentKey: null,
    status: "approved",
    reviewedBy: 1,
    reviewedAt: new Date("2026-08-14T00:00:00Z"),
    createdBy: 1,
    createdAt: new Date("2026-08-13T00:00:00Z"),
  },
  {
    id: 3,
    strainId: 3,
    labName: "Green Leaf Testing Facility",
    reportNumber: "COA-GLT-9021-SD",
    batchLot: "LOT-SD-991",
    testedAt: new Date("2026-08-11T00:00:00Z"),
    cannabinoidResults: {
      "THCA": "23.9%",
      "d9-THC": "0.9%",
      "CBDA": "0.22%",
      "CBG": "0.95%",
      "Total Cannabinoids": "25.97%",
    },
    terpeneSummary: {
      "d-Limonene": "1.25%",
      "beta-Caryophyllene": "0.78%",
      "Myrcene": "0.62%",
      "Total Terpenes": "2.65%",
    },
    sourceReference: "https://gwave.market/verify/COA-GLT-9021-SD",
    privateDocumentKey: null,
    status: "approved",
    reviewedBy: 1,
    reviewedAt: new Date("2026-08-12T00:00:00Z"),
    createdBy: 1,
    createdAt: new Date("2026-08-11T00:00:00Z"),
  },
];

// Initial Seed News Posts
export const SEED_POSTS: NewsPostItem[] = [
  {
    id: 1,
    category: "gwave_news",
    title: "Gwave Verification Standard 2026: Lab Testing Transparency & Live COA Reports",
    slug: "gwave-verification-standard-2026",
    excerpt: "How Gwave enforces third-party laboratory verification for cannabinoid profiles, terpene analytics, and batch records.",
    body: "At Gwave, every strain record and batch item is anchored in verified facts rather than promotional claims. Our 2026 verification protocol guarantees that all cannabinoid metrics and terpene mappings are backed by accredited third-party certificates of analysis.",
    status: "published",
    authorId: 1,
    reviewerId: 1,
    approvedBy: 1,
    publishedAt: new Date("2026-08-18T00:00:00Z"),
    createdAt: new Date("2026-08-17T00:00:00Z"),
    updatedAt: new Date("2026-08-18T00:00:00Z"),
  },
  {
    id: 2,
    category: "new_arrivals",
    title: "Brand Signal 001: Heavyweight Apparel & Modular Tactical Utility Gear",
    slug: "brand-signal-001-launch",
    excerpt: "Introducing the Gwave Brand Signal capsule: 480 GSM hoodies, 1000D Cordura utility vests, and precision-machined tools.",
    body: "The Gwave Brand Signal capsule merges industrial craftsmanship with durable streetwear aesthetics. Each garment is engineered with reinforced stitching, magnetic closures, and heavy organic cotton.",
    status: "published",
    authorId: 1,
    reviewerId: 1,
    approvedBy: 1,
    publishedAt: new Date("2026-08-19T00:00:00Z"),
    createdAt: new Date("2026-08-18T00:00:00Z"),
    updatedAt: new Date("2026-08-19T00:00:00Z"),
  },
  {
    id: 3,
    category: "legal_safety",
    title: "21+ Access Control Architecture: Responsible Governance in Modern E-Commerce",
    slug: "21-plus-access-control-architecture",
    excerpt: "A breakdown of our dual-tier catalogue design: public lifestyle merchandise versus authenticated 21+ restricted botanical access.",
    body: "Compliance and safety are fundamental architectural pillars of the Gwave platform. Our systems explicitly separate open lifestyle merchandise from restricted agricultural varieties through authenticated age-gate acknowledgements.",
    status: "published",
    authorId: 1,
    reviewerId: 1,
    approvedBy: 1,
    publishedAt: new Date("2026-08-20T00:00:00Z"),
    createdAt: new Date("2026-08-19T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: 4,
    category: "knowledge",
    title: "Terpene Science: Why Aroma Compounds Define the Botanical Experience",
    slug: "terpene-science-beyond-percentages",
    excerpt: "Exploring myrcene, limonene, caryophyllene, and pinene — how terpenes modulate botanical synergy.",
    body: "While cannabinoid percentages often dominate headlines, the true character of any botanical strain is governed by its complex terpene matrix. Explore how differing ratios of myrcene, limonene, and caryophyllene define the sensory profile.",
    status: "published",
    authorId: 1,
    reviewerId: 1,
    approvedBy: 1,
    publishedAt: new Date("2026-08-21T00:00:00Z"),
    createdAt: new Date("2026-08-20T00:00:00Z"),
    updatedAt: new Date("2026-08-21T00:00:00Z"),
  },
];
