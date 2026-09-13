CREATE TYPE "public"."reporter_notification_type" AS ENUM('general', 'status_changed', 'priority_changed', 'agent_reply');--> statement-breakpoint
ALTER TABLE "agent_notifications" ADD COLUMN "dedup_key" text;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "type" "reporter_notification_type" DEFAULT 'general' NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "dedup_key" text;--> statement-breakpoint
ALTER TABLE "agent_notifications" ADD CONSTRAINT "agent_notifications_dedup_key_unique" UNIQUE("dedup_key");--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_dedup_key_unique" UNIQUE("dedup_key");