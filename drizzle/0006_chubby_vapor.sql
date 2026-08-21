CREATE TABLE `productImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`storageUrl` varchar(700) NOT NULL,
	`altText` varchar(220) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stockReservations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reservationKey` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`variantId` int NOT NULL,
	`quantity` int NOT NULL,
	`status` enum('active','released','consumed','expired') NOT NULL DEFAULT 'active',
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stockReservations_id` PRIMARY KEY(`id`),
	CONSTRAINT `stockReservations_reservationKey_unique` UNIQUE(`reservationKey`)
);
