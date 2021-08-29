-- CreateEnum
CREATE TYPE "status_type" AS ENUM ('SENT', 'IN_PROGRESS', 'DONE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "status" "status_type" NOT NULL DEFAULT E'SENT';

-- Objectionjs migration
INSERT INTO "migrationTable" ("migration_time", "name", "batch")
VALUES (CURRENT_TIMESTAMP, '20200828113656_migration_add_status_for_tickets.ts', 1);
