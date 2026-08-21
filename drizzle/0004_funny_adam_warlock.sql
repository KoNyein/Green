ALTER TABLE `strains` ADD `thcMinPercent` decimal(5,2);--> statement-breakpoint
ALTER TABLE `strains` ADD `thcMaxPercent` decimal(5,2);--> statement-breakpoint
ALTER TABLE `strains` ADD `cbdMinPercent` decimal(5,2);--> statement-breakpoint
ALTER TABLE `strains` ADD `cbdMaxPercent` decimal(5,2);--> statement-breakpoint
ALTER TABLE `strains` ADD `effectTags` json;--> statement-breakpoint
ALTER TABLE `strains` ADD `cannabinoidSource` varchar(500);--> statement-breakpoint
ALTER TABLE `strains` ADD `effectSource` varchar(500);--> statement-breakpoint
ALTER TABLE `strains` ADD `profileReviewedAt` timestamp;
