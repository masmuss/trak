ALTER TABLE "reports" ADD COLUMN "last_activity_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
UPDATE "reports" SET "last_activity_at" = "created_at";--> statement-breakpoint
CREATE OR REPLACE FUNCTION "touch_report_activity"() RETURNS trigger AS $$
BEGIN
  IF TG_TABLE_NAME = 'reports' THEN
    NEW."last_activity_at" = now();
  ELSE
    UPDATE "reports" SET "last_activity_at" = now() WHERE "id" = NEW."report_id";
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
CREATE TRIGGER "reports_activity_touch"
BEFORE UPDATE ON "reports"
FOR EACH ROW
WHEN (
  OLD."status" IS DISTINCT FROM NEW."status"
  OR OLD."priority" IS DISTINCT FROM NEW."priority"
  OR OLD."assigned_to" IS DISTINCT FROM NEW."assigned_to"
  OR OLD."title" IS DISTINCT FROM NEW."title"
  OR OLD."body" IS DISTINCT FROM NEW."body"
  OR OLD."category_id" IS DISTINCT FROM NEW."category_id"
  OR OLD."resolved_at" IS DISTINCT FROM NEW."resolved_at"
  OR OLD."first_response_at" IS DISTINCT FROM NEW."first_response_at"
)
EXECUTE FUNCTION "touch_report_activity"();--> statement-breakpoint
CREATE TRIGGER "ticket_messages_activity_touch"
AFTER INSERT ON "ticket_messages" FOR EACH ROW EXECUTE FUNCTION "touch_report_activity"();--> statement-breakpoint
CREATE TRIGGER "report_attachments_activity_touch"
AFTER INSERT ON "report_attachments" FOR EACH ROW EXECUTE FUNCTION "touch_report_activity"();--> statement-breakpoint
CREATE TRIGGER "status_histories_activity_touch"
AFTER INSERT ON "status_histories" FOR EACH ROW EXECUTE FUNCTION "touch_report_activity"();