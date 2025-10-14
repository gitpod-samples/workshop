#!/usr/bin/env bash

set -e

# Determine the script's directory
FEATURE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Installing PostgreSQL 16 from local packages..."

# Ensure we're running as root
if [ "$(id -u)" -ne 0 ]; then
    echo "Error: This script must be run as root"
    exit 1
fi

# Install system dependencies
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y --no-install-recommends \
    locales \
    tzdata \
    sudo

# Install library dependencies from local .deb files
echo "Installing library dependencies..."
dpkg -i "${FEATURE_DIR}"/libicu70*.deb 2>&1 || true
dpkg -i "${FEATURE_DIR}"/liblz4*.deb 2>&1 || true
dpkg -i "${FEATURE_DIR}"/libzstd*.deb 2>&1 || true
dpkg -i "${FEATURE_DIR}"/libldap*.deb 2>&1 || true
dpkg -i "${FEATURE_DIR}"/libllvm*.deb 2>&1 || true
dpkg -i "${FEATURE_DIR}"/ssl-cert*.deb 2>&1 || true
dpkg -i "${FEATURE_DIR}"/libpq5*.deb 2>&1 || true
dpkg -i "${FEATURE_DIR}"/libjson-perl*.deb 2>&1 || true

# Fix any dependency issues
apt-get install -f -y

# Install PostgreSQL packages in correct order
echo "Installing PostgreSQL common packages..."
dpkg -i "${FEATURE_DIR}"/postgresql-client-common*.deb 2>&1 || true
dpkg -i "${FEATURE_DIR}"/postgresql-common*.deb 2>&1 || true
dpkg -i "${FEATURE_DIR}"/postgresql-client-16*.deb 2>&1 || true

# Fix any dependency issues
apt-get install -f -y

echo "Installing PostgreSQL 16 server..."
dpkg -i "${FEATURE_DIR}"/postgresql-16_*.deb 2>&1 || true

# Fix any remaining dependency issues
apt-get install -f -y

# Verify postgres user was created
if ! id postgres >/dev/null 2>&1; then
    echo "ERROR: postgres user was not created by package installation"
    exit 1
fi

# Configure PostgreSQL to allow trust authentication
PG_VERSION="16"
PG_CONF_DIR="/etc/postgresql/${PG_VERSION}/main"

# Ensure config directory exists (should be created by package)
if [ ! -d "${PG_CONF_DIR}" ]; then
    echo "Creating PostgreSQL configuration directory..."
    mkdir -p "${PG_CONF_DIR}"
    if id postgres >/dev/null 2>&1; then
        chown -R postgres:postgres "/etc/postgresql/${PG_VERSION}"
    fi
fi

# Create pg_hba.conf with trust authentication
cat > "${PG_CONF_DIR}/pg_hba.conf" << 'EOF'
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
host    all             all             0.0.0.0/0               trust
host    all             all             ::/0                    trust
EOF

# Create or update postgresql.conf
if [ -f "${PG_CONF_DIR}/postgresql.conf" ]; then
    # Configure PostgreSQL to listen on all addresses
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "${PG_CONF_DIR}/postgresql.conf"
else
    echo "listen_addresses = '*'" > "${PG_CONF_DIR}/postgresql.conf"
    if id postgres >/dev/null 2>&1; then
        chown postgres:postgres "${PG_CONF_DIR}/postgresql.conf"
    fi
fi

# Set proper ownership on config files
if id postgres >/dev/null 2>&1; then
    chown postgres:postgres "${PG_CONF_DIR}/pg_hba.conf" 2>/dev/null || true
    chown postgres:postgres "${PG_CONF_DIR}/postgresql.conf" 2>/dev/null || true
fi

# Create data directory with proper permissions
mkdir -p /var/lib/postgresql/data
if id postgres >/dev/null 2>&1; then
    chown -R postgres:postgres /var/lib/postgresql
    chmod 0750 /var/lib/postgresql/data
fi

# Note: Database initialization will be done at runtime by pg-init.sh
# We don't initialize here because the data directory might be a volume mount

# Set environment variables
cat >> /etc/environment << 'EOF'
PGDATA=/var/lib/postgresql/data
PGHOST=localhost
PGUSER=postgres
EOF

# Clean up
apt-get clean
rm -rf /var/lib/apt/lists/*

echo "PostgreSQL 16 installed successfully!"
