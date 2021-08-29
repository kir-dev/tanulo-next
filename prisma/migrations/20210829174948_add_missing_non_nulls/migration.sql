/*
  Warnings:

  - Made the column `tags` on table `groups` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `groups` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `groups` required. This step will fail if there are existing NULL values in that column.
  - Made the column `owner_id` on table `groups` required. This step will fail if there are existing NULL values in that column.
  - Made the column `max_attendees` on table `groups` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `tickets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `tickets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `tickets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `want_email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `users_groups` required. This step will fail if there are existing NULL values in that column.
  - Made the column `group_id` on table `users_groups` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "groups" ALTER COLUMN "tags" SET NOT NULL,
ALTER COLUMN "tags" SET DEFAULT E'',
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT E'',
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "owner_id" SET NOT NULL,
ALTER COLUMN "max_attendees" SET NOT NULL;

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "want_email" SET NOT NULL;

-- AlterTable
ALTER TABLE "users_groups" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "group_id" SET NOT NULL;
