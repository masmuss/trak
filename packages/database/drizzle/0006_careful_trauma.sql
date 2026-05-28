CREATE TYPE "public"."priority" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "priority" "priority" DEFAULT 'MEDIUM' NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "sla_response_due" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "sla_resolve_due" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "first_response_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "resolved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "is_sla_breached" boolean DEFAULT false NOT NULL;