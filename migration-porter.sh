#!/usr/bin/bash

source './.env'

# basenames of knex migration files
# migrations=`ls ./migrations/*.ts | cut -c 14- | rev | cut -c 4- | rev`

migrations=(
    '20200328131352_initial_schema' #1
    '20200328173956_add_owner_id_to_group' #2
    '20200408124626_add_non_nullable' #3
    '20200510001427_add_floor_to_profile' #4
    '20200527121145_rename_column_in_groups' #5
    '20200721213650_update_description_lengths' #6
    '20200828113656_migration_add_status_for_tickets' #7
    '20201012224257_add_max_attendees' #8
    '20201013225752_add_role_to_user' #9
    '20210418152354_add_user_id_to_tickets' #10
    '20210611222535_add_place_and_link_to_groups' #11
    '20210626192847_add_wantemail_to_user' #12
)

if [[ "$1" = "--help" ]]
then
    echo 'Convert knex migrations into prisma migrations.'
    echo 'Usage:'
    echo '  ./migration-porter.sh [start from = 1]'
    exit 0
fi

START_FROM_IDX="${1:-1}"

for i in `seq $START_FROM_IDX ${#migrations[@]}`
do
    F="${migrations[$i-1]}"

    echo "Porting migration $F"
    docker run --name 'tanulo-migration' -e POSTGRES_USER="$DB_USERNAME" -e POSTGRES_PASSWORD="$DB_PASSWORD" -e POSTGRES_DB="$tanulo" --rm --net host -d postgres

    sleep 10

    for j in `seq $i`
    do
        npx knex migrate:up
    done

    npx prisma db pull
    echo 'y' | npx prisma migrate dev --create-only -n "$F"
    mv ./prisma/migrations/*"$F" -n ./prisma/migrations/"$F"
    echo -e "\n-- Objectionjs migration\nINSERT INTO \"migrationTable\" (\"migration_time\", \"name\", \"batch\")\nVALUES (\n  CURRENT_TIMESTAMP,\n  '$F.ts',\n  1);\n" >> "./prisma/migrations/$F/migration.sql"

    docker kill 'tanulo-migration'
    sleep 3
done
