CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION uuid_generate_v7()
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  timestamp_ms BIGINT;
  bytes BYTEA;
BEGIN
  timestamp_ms := (EXTRACT(EPOCH FROM clock_timestamp()) * 1000)::BIGINT;
  bytes := gen_random_bytes(16);

  -- Set timestamp (big-endian) in bytes 0-5
  bytes := set_byte(bytes, 0, ((timestamp_ms >> 40) & 255)::INT);
  bytes := set_byte(bytes, 1, ((timestamp_ms >> 32) & 255)::INT);
  bytes := set_byte(bytes, 2, ((timestamp_ms >> 24) & 255)::INT);
  bytes := set_byte(bytes, 3, ((timestamp_ms >> 16) & 255)::INT);
  bytes := set_byte(bytes, 4, ((timestamp_ms >> 8) & 255)::INT);
  bytes := set_byte(bytes, 5, (timestamp_ms & 255)::INT);

  -- Set version 7 in byte 6 top nibble
  bytes := set_byte(bytes, 6, (get_byte(bytes, 6) & 15) | (7 << 4));

  -- Set variant 10xx in byte 8 top 2 bits
  bytes := set_byte(bytes, 8, (get_byte(bytes, 8) & 63) | 128);

  RETURN encode(bytes, 'hex')::UUID;
END;
$$;--> statement-breakpoint

ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7();--> statement-breakpoint
ALTER TABLE "invite_codes" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7();--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7();--> statement-breakpoint
ALTER TABLE "report_attachments" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7();--> statement-breakpoint
ALTER TABLE "reporters" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7();--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7();--> statement-breakpoint
ALTER TABLE "status_histories" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7();