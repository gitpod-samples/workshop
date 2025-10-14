# PostgreSQL Feature (Offline)

This feature installs PostgreSQL 16 from local .deb packages, enabling offline installation.

## Contents

- `devcontainer-feature.json` - Feature manifest
- `install.sh` - Installation script
- `pg-init.sh` - PostgreSQL initialization script
- `*.deb` - PostgreSQL 16 and dependency packages

## Packages Included

- postgresql-16_16.10-1.pgdg22.04+1_amd64.deb
- postgresql-client-16_16.10-1.pgdg22.04+1_amd64.deb
- postgresql-common_285.pgdg22.04+1_all.deb
- ssl-cert_1.1.2_all.deb
- libpq5, libicu70, liblz4-1, libzstd1, libldap-2.5-0, libllvm15

## Configuration

PostgreSQL is configured with trust authentication for local development:
- Listens on all addresses
- Trust authentication for all connections
- Data directory: /var/lib/postgresql/data
