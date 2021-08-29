-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "subject" VARCHAR(255),
    "description" VARCHAR(255),
    "start_date" TIMESTAMPTZ(6),
    "end_date" TIMESTAMPTZ(6),
    "room" INTEGER,
    "do_not_disturb" BOOLEAN,
    "created_at" TIMESTAMPTZ(6),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrationTable" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "batch" INTEGER,
    "migration_time" TIMESTAMPTZ(6),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrationTable_lock" (
    "index" SERIAL NOT NULL,
    "is_locked" INTEGER,

    PRIMARY KEY ("index")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255),
    "room_number" INTEGER,
    "created_at" TIMESTAMPTZ(6),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255),
    "auth_sch_id" VARCHAR(255),
    "admin" BOOLEAN,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_groups" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "group_id" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_groups_groupid_index" ON "users_groups"("group_id");

-- CreateIndex
CREATE INDEX "users_groups_userid_index" ON "users_groups"("user_id");

-- AddForeignKey
ALTER TABLE "users_groups" ADD FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_groups" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Objectionjs migration
INSERT INTO "migrationTable" ("migration_time", "name", "batch")
VALUES (CURRENT_TIMESTAMP, '20200328131352_initial_schema.ts', 1);
