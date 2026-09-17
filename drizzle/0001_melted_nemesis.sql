CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`title` varchar(220) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`category` varchar(80) NOT NULL,
	`coverImage` varchar(500),
	`published` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(60),
	`subject` varchar(180),
	`message` text NOT NULL,
	`status` enum('new','read','replied','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`logoUrl` varchar(500),
	`websiteUrl` varchar(500),
	`published` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(60),
	`company` varchar(160),
	`origin` varchar(160) NOT NULL,
	`destination` varchar(160) NOT NULL,
	`shipmentType` varchar(80) NOT NULL,
	`cargoDescription` text NOT NULL,
	`weight` varchar(80),
	`dimensions` varchar(120),
	`shippingMethod` varchar(100),
	`notes` text,
	`status` enum('new','reviewing','quoted','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shipment_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shipmentId` int NOT NULL,
	`status` varchar(80) NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text,
	`location` varchar(160),
	`eventTime` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shipment_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shipments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trackingNumber` varchar(32) NOT NULL,
	`status` enum('booked','in_transit','customs','out_for_delivery','delivered','exception') NOT NULL DEFAULT 'booked',
	`origin` varchar(160) NOT NULL,
	`destination` varchar(160) NOT NULL,
	`currentLocation` varchar(160),
	`estimatedDelivery` timestamp,
	`shipmentType` enum('air','ocean','road','rail','multimodal') NOT NULL,
	`serviceLevel` varchar(80),
	`weight` varchar(80),
	`customerEmail` varchar(320),
	`lastUpdate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shipments_id` PRIMARY KEY(`id`),
	CONSTRAINT `shipments_tracking_idx` UNIQUE(`trackingNumber`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quote` text NOT NULL,
	`name` varchar(160) NOT NULL,
	`role` varchar(160),
	`company` varchar(160),
	`avatarUrl` varchar(500),
	`published` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `blog_published_idx` ON `blog_posts` (`published`,`publishedAt`);--> statement-breakpoint
CREATE INDEX `contacts_status_idx` ON `contacts` (`status`);--> statement-breakpoint
CREATE INDEX `quotes_status_idx` ON `quotes` (`status`);--> statement-breakpoint
CREATE INDEX `quotes_email_idx` ON `quotes` (`email`);--> statement-breakpoint
CREATE INDEX `shipment_events_shipment_idx` ON `shipment_events` (`shipmentId`);--> statement-breakpoint
CREATE INDEX `shipment_events_time_idx` ON `shipment_events` (`eventTime`);--> statement-breakpoint
CREATE INDEX `shipments_status_idx` ON `shipments` (`status`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);