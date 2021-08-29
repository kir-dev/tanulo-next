-- AlterTable
ALTER TABLE "groups" ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- Objectionjs migration
INSERT INTO "migrationTable" ("migration_time", "name", "batch")
VALUES (CURRENT_TIMESTAMP,'20200721213650_update_description_lengths.ts', 1);
