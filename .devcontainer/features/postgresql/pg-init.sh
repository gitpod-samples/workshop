#!/bin/bash

set -e

PG_VERSION="16"
PGDATA="${PGDATA:-/var/lib/postgresql/data}"

echo "Starting PostgreSQL ${PG_VERSION}..."

# Ensure data directory exists and has correct permissions
if [ ! -d "$PGDATA" ]; then
    mkdir -p "$PGDATA"
    chown -R postgres:postgres "$PGDATA"
    chmod 0750 "$PGDATA"
fi

# Initialize database if not already initialized
if [ ! -f "$PGDATA/PG_VERSION" ]; then
    echo "Initializing PostgreSQL database..."
    sudo -u postgres /usr/lib/postgresql/${PG_VERSION}/bin/initdb \
        -D "$PGDATA" \
        --auth=trust \
        --auth-local=trust \
        --auth-host=trust
    
    # Configure the data directory
    echo "listen_addresses = '*'" >> "$PGDATA/postgresql.conf"
    cat > "$PGDATA/pg_hba.conf" << 'EOF'
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
host    all             all             0.0.0.0/0               trust
host    all             all             ::/0                    trust
EOF
    chown postgres:postgres "$PGDATA/postgresql.conf" "$PGDATA/pg_hba.conf"
fi

# Start PostgreSQL
sudo service postgresql start

# Wait for PostgreSQL to be ready
for i in {1..30}; do
    if pg_isready -q; then
        echo "PostgreSQL is ready!"
        exit 0
    fi
    echo "Waiting for PostgreSQL... ($i/30)"
    sleep 1
done

echo "PostgreSQL failed to start within 30 seconds"
exit 1
