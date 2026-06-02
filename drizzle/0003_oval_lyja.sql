CREATE TABLE `ride_location_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ride_id` int NOT NULL,
	`latitude` decimal(10,7) NOT NULL,
	`longitude` decimal(10,7) NOT NULL,
	`speed` decimal(6,2),
	`heading` decimal(6,2),
	`recorded_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ride_location_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rider_id` int NOT NULL,
	`pickup_address` text NOT NULL,
	`drop_address` text NOT NULL,
	`pickup_latitude` decimal(10,7) NOT NULL,
	`pickup_longitude` decimal(10,7) NOT NULL,
	`drop_latitude` decimal(10,7) NOT NULL,
	`drop_longitude` decimal(10,7) NOT NULL,
	`distance_km` decimal(10,2),
	`estimated_fare` decimal(10,2),
	`final_fare` decimal(10,2),
	`ride_type` varchar(50) NOT NULL DEFAULT 'STANDARD',
	`payment_method` varchar(50) DEFAULT 'CASH',
	`payment_status` varchar(50) NOT NULL DEFAULT 'PENDING',
	`status` varchar(50) NOT NULL DEFAULT 'REQUESTED',
	`cancel_reason` text,
	`requested_at` timestamp NOT NULL DEFAULT (now()),
	`accepted_at` timestamp,
	`started_at` timestamp,
	`completed_at` timestamp,
	`cancelled_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_login` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`email` varchar(191) NOT NULL,
	`password` varchar(191) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_login_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `user_login` ADD CONSTRAINT `user_login_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `ride_location_logs_ride_idx` ON `ride_location_logs` (`ride_id`);--> statement-breakpoint
CREATE INDEX `ride_location_logs_recorded_at_idx` ON `ride_location_logs` (`recorded_at`);--> statement-breakpoint
CREATE INDEX `rides_rider_idx` ON `rides` (`rider_id`);--> statement-breakpoint
CREATE INDEX `rides_status_idx` ON `rides` (`status`);