-- AlterTable
ALTER TABLE "groups"
RENAME COLUMN "subject" TO "tags";

-- Objectionjs migration
INSERT INTO "migrationTable" ("migration_time", "name", "batch")
VALUES (CURRENT_TIMESTAMP, '20200527121145_rename_column_in_groups.ts', 1);
