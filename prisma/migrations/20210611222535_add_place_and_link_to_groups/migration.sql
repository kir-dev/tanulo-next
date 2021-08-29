-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "link" VARCHAR(255),
ADD COLUMN     "place" VARCHAR(255),
ALTER COLUMN "room" DROP NOT NULL;

-- Objectionjs migration
INSERT INTO "migrationTable" ("migration_time", "name", "batch")
VALUES (CURRENT_TIMESTAMP, '20210611222535_add_place_and_link_to_groups.ts', 1);
