CREATE TABLE `ageAcknowledgements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`policyVersion` varchar(40) NOT NULL,
	`acceptedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ageAcknowledgements_id` PRIMARY KEY(`id`),
	CONSTRAINT `age_acknowledgement_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderReference` varchar(40),
	`email` varchar(320) NOT NULL,
	`phone` varchar(40),
	`message` text NOT NULL,
	`status` enum('open','closed') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` enum('gwave_news','new_arrivals','knowledge','promotion','legal_safety') NOT NULL,
	`title` varchar(160) NOT NULL,
	`slug` varchar(180) NOT NULL,
	`excerpt` text NOT NULL,
	`body` text NOT NULL,
	`status` enum('draft','review','approved','published') NOT NULL DEFAULT 'draft',
	`authorId` int NOT NULL,
	`reviewerId` int,
	`approvedBy` int,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsPosts_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsPosts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`variantId` int,
	`itemName` varchar(180) NOT NULL,
	`unitPriceCents` int NOT NULL,
	`quantity` int NOT NULL,
	`selectedOptions` json,
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderStatusAudits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`previousStatus` enum('payment_pending','payment_under_review','approved_for_fulfilment','packing','shipped','completed','cancelled','refund_pending'),
	`nextStatus` enum('payment_pending','payment_under_review','approved_for_fulfilment','packing','shipped','completed','cancelled','refund_pending') NOT NULL,
	`actorId` int NOT NULL,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderStatusAudits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference` varchar(40) NOT NULL,
	`userId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(40) NOT NULL,
	`shippingAddress` text NOT NULL,
	`totalCents` int NOT NULL,
	`status` enum('payment_pending','payment_under_review','approved_for_fulfilment','packing','shipped','completed','cancelled','refund_pending') NOT NULL DEFAULT 'payment_pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_reference_unique` UNIQUE(`reference`)
);
--> statement-breakpoint
CREATE TABLE `paymentSlips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`storageKey` varchar(500) NOT NULL,
	`contentType` varchar(100) NOT NULL,
	`originalFilename` varchar(160) NOT NULL,
	`uploadedBy` int NOT NULL,
	`status` enum('pending','verified','rejected','expired') NOT NULL DEFAULT 'pending',
	`expiresAt` timestamp,
	`reviewedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `paymentSlips_id` PRIMARY KEY(`id`),
	CONSTRAINT `paymentSlips_storageKey_unique` UNIQUE(`storageKey`)
);
--> statement-breakpoint
CREATE TABLE `productVariants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`sku` varchar(80) NOT NULL,
	`label` varchar(100) NOT NULL,
	`size` varchar(40),
	`color` varchar(60),
	`priceCents` int NOT NULL,
	`stock` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productVariants_id` PRIMARY KEY(`id`),
	CONSTRAINT `productVariants_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`name` varchar(180) NOT NULL,
	`category` enum('seed','farm','merch') NOT NULL,
	`isRestricted` boolean NOT NULL DEFAULT false,
	`description` text NOT NULL,
	`highlights` json NOT NULL,
	`basePriceCents` int NOT NULL,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isPublished` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `strains` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int,
	`slug` varchar(180) NOT NULL,
	`name` varchar(180) NOT NULL,
	`classification` varchar(100) NOT NULL,
	`verifiedFacts` text NOT NULL,
	`supplierDescription` text NOT NULL,
	`educationalNote` text NOT NULL,
	`legalNotice` text NOT NULL,
	`isPublished` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `strains_id` PRIMARY KEY(`id`),
	CONSTRAINT `strains_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','staff','admin') NOT NULL DEFAULT 'user';