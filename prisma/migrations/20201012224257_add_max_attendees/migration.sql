-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "max_attendees" INTEGER DEFAULT 100;

-- Objectionjs migration
INSERT INTO "migrationTable" ("migration_time", "name", "batch")
VALUES (CURRENT_TIMESTAMP, '20201012224257_add_max_attendees.ts', 1);
