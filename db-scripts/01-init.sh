#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    ALTER ROLE admin SET client_encoding TO 'utf8';
    ALTER ROLE admin SET timezone TO 'UTC';
EOSQL