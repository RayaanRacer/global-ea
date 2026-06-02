ALTER TABLE `users` MODIFY COLUMN `email` varchar(191) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `uuid` varchar(191) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `first_name` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `last_name` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `role` varchar(50) DEFAULT 'ADMIN' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `status` varchar(50) DEFAULT 'ACTIVE' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `is_email_verified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `is_phone_verified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `is_2fa_enabled` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `profile_image` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `last_login_at` cal::local_datetime;--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` cal::local_datetime DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` cal::local_datetime DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `deleted_at` cal::local_datetime;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_uuid_unique` UNIQUE(`uuid`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_phone_unique` UNIQUE(`phone`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_phone_idx` ON `users` (`phone`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `name`;