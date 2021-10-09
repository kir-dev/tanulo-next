-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "owner_id" INTEGER;

-- CreateIndex
CREATE INDEX "groups_ownerid_index" ON "groups"("owner_id");

-- AddForeignKey
ALTER TABLE "groups" ADD FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Objectionjs migration
INSERT INTO "migrationTable" ("migration_time", "name", "batch")
VALUES (CURRENT_TIMESTAMP, '20200328173956_add_owner_id_to_group.ts', 1);
