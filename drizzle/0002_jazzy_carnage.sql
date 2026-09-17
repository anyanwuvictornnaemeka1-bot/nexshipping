CREATE TABLE `shipment_audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shipmentId` int NOT NULL,
	`actorId` int NOT NULL,
	`actorName` varchar(160) NOT NULL,
	`actorEmail` varchar(320),
	`action` enum('created','updated','deleted','event_added','bulk_imported') NOT NULL,
	`summary` varchar(500) NOT NULL,
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shipment_audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `shipment_audit_shipment_idx` ON `shipment_audit_logs` (`shipmentId`);--> statement-breakpoint
CREATE INDEX `shipment_audit_actor_idx` ON `shipment_audit_logs` (`actorId`);--> statement-breakpoint
CREATE INDEX `shipment_audit_created_idx` ON `shipment_audit_logs` (`createdAt`);