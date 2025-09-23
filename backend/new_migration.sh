#!/bin/bash

MIG_DIR="app/db/migrations"

NAME_UP="$(date '+%Y%m%d_%H%M')_$1.up.sql"
NAME_DOWN="$(date '+%Y%m%d_%H%M')_$1.down.sql"

touch "$MIG_DIR/$NAME_UP"
touch "$MIG_DIR/$NAME_DOWN"