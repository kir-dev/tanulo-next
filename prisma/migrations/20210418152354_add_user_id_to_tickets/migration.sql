-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "user_id" INTEGER;

-- CreateIndex
CREATE INDEX "tickets_userid_index" ON "tickets"("user_id");

-- AddForeignKey
ALTER TABLE "tickets" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Objectionjs migration
INSERT INTO "migrationTable" ("migration_time", "name", "batch")
VALUES (CURRENT_TIMESTAMP, '20210418152354_add_user_id_to_tickets.ts', 1);
