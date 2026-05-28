ALTER TABLE "reports" ADD COLUMN "ticket_id" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_ticket_id_unique" UNIQUE("ticket_id");