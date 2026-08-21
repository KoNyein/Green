CREATE TABLE `coaReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`strainId` int NOT NULL,
	`labName` varchar(180) NOT NULL,
	`reportNumber` varchar(120) NOT NULL,
	`batchLot` varchar(120),
	`testedAt` timestamp,
	`cannabinoidResults` json NOT NULL,
	`terpeneSummary` json NOT NULL,
	`sourceReference` varchar(500) NOT NULL,
	`privateDocumentKey` varchar(500),
	`status` enum('draft','review','approved','rejected') NOT NULL DEFAULT 'draft',
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coaReports_id` PRIMARY KEY(`id`)
);
