ALTER TABLE "reports" RENAME COLUMN "ticket_id" TO "ticket_code";--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT "reports_ticket_id_unique";--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_ticket_code_unique" UNIQUE("ticket_code");