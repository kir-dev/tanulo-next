/*
  Warnings:

  - You are about to drop the column `admin` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "role_type" AS ENUM ('ADMIN', 'TICKET_ADMIN', 'USER');

-- AlterTable
ALTER TABLE "users"
ADD COLUMN     "role" "role_type" NOT NULL DEFAULT E'USER';

-- Transfer data
UPDATE "users"
SET "role" = E'ADMIN'
WHERE "admin"=true;

-- Drop column
ALTER TABLE "users"
DROP COLUMN "admin";

-- Objectionjs migration
INSERT INTO "migrationTable" ("migration_time", "name", "batch")
VALUES (CURRENT_TIMESTAMP, '20201013225752_add_role_to_user.ts', 1);
