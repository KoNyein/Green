CREATE TABLE `paymentSlipAccessAudits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`paymentSlipId` int NOT NULL,
	`actorId` int NOT NULL,
	`action` enum('uploaded','opened','expired') NOT NULL,
	`detail` varchar(300),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `paymentSlipAccessAudits_id` PRIMARY KEY(`id`)
);
