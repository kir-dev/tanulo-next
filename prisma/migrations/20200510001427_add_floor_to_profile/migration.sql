-- AlterTable
ALTER TABLE "users" ADD COLUMN     "floor" INTEGER;

-- Objectionjs migration
INSERT INTO "migrationTable" ("migration_time", "name", "batch")
VALUES (CURRENT_TIMESTAMP, '20200510001427_add_floor_to_profile.ts', 1);
