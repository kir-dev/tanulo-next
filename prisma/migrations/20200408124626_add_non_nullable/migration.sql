/*
  Warnings:

  - Made the column `name` on table `groups` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_date` on table `groups` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_date` on table `groups` required. This step will fail if there are existing NULL values in that column.
  - Made the column `room` on table `groups` required. This step will fail if there are existing NULL values in that column.
  - Made the column `do_not_disturb` on table `groups` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `tickets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `room_number` on table `tickets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `auth_sch_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "groups" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "start_date" SET NOT NULL,
ALTER COLUMN "end_date" SET NOT NULL,
ALTER COLUMN "room" SET NOT NULL,
ALTER COLUMN "do_not_disturb" SET NOT NULL;

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "room_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "auth_sch_id" SET NOT NULL;

-- Objectionjs migration
INSERT INTO "migrationTable" ("migration_time", "name", "batch")
VALUES (CURRENT_TIMESTAMP, '20200408124626_add_non_nullable.ts', 1);
