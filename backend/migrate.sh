#!/bin/bash

set -euo pipefail

source .env

DB_URL="postgres://$PSQL_USER:$PSQL_PASSWORD@localhost:5432/$PSQL_DB?sslmode=disable"
MIG_DIR="app/db/migrations"

psql "$DB_URL" -c "
    CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMP NOT NULL DEFAULT now()
    );
"

APPLIED=$(psql "$DB_URL" -A -t -q -c "SELECT version FROM schema_migrations")

for FILE in $(ls "$MIG_DIR"/*.up.sql | sort); do
    VERSION=$(basename "$FILE" .up.sql)
    echo $VERSION

    if echo "$APPLIED" | grep -qx "$VERSION"; then
        echo "Migration $VERSION already applied, skipping."
        continue
    else
        echo "Applying $VERSION"
        psql "$DB_URL" -f "$FILE"
        psql "$DB_URL" -c "INSERT INTO schema_migrations (version) VALUES ('$VERSION');"
    fi
done

echo "All migrations applied"