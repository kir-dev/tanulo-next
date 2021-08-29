-- AlterTable
ALTER TABLE "users" ADD COLUMN     "want_email" BOOLEAN DEFAULT true;

-- Objectionjs migration
INSERT INTO "migrationTable" ("migration_time", "name", "batch")
VALUES (CURRENT_TIMESTAMP, '20210626192847_add_wantemail_to_user.ts', 1);
