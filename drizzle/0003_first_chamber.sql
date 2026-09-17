ALTER TABLE `quotes` ADD `customerOpenId` varchar(64);--> statement-breakpoint
ALTER TABLE `shipments` ADD `customerOpenId` varchar(64);--> statement-breakpoint
CREATE INDEX `quotes_customer_open_id_idx` ON `quotes` (`customerOpenId`);--> statement-breakpoint
CREATE INDEX `shipments_customer_open_id_idx` ON `shipments` (`customerOpenId`);