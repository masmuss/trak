CREATE TYPE "public"."agent_notification_type" AS ENUM('reporter_reply', 'assignment');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('open', 'in_progress', 'resolved', 'closed');--> statement-breakpoint
ALTER TABLE "agent_notifications" ALTER COLUMN "type" SET DATA TYPE "public"."agent_notification_type" USING "type"::"public"."agent_notification_type";--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "status" SET DEFAULT 'open'::"public"."ticket_status";--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "status" SET DATA TYPE "public"."ticket_status" USING "status"::"public"."ticket_status";--> statement-breakpoint
ALTER TABLE "status_histories" ALTER COLUMN "old_status" SET DATA TYPE "public"."ticket_status" USING "old_status"::"public"."ticket_status";--> statement-breakpoint
ALTER TABLE "status_histories" ALTER COLUMN "new_status" SET DATA TYPE "public"."ticket_status" USING "new_status"::"public"."ticket_status";