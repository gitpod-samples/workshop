# PostgreSQL Feature (Offline)

This feature installs PostgreSQL 16 from local .deb packages, enabling completely offline installation.

## Contents

- `devcontainer-feature.json` - Feature manifest
- `install.sh` - Installation script (no internet required)
- `pg-init.sh` - PostgreSQL initialization script
- `*.deb` - PostgreSQL 16 and dependency packages (11 files, ~57MB)

## Packages Included

PostgreSQL packages:
- postgresql-16_16.10-1.pgdg22.04+1_amd64.deb
- postgresql-client-16_16.10-1.pgdg22.04+1_amd64.deb
- postgresql-common_285.pgdg22.04+1_all.deb
- postgresql-client-common_285.pgdg22.04+1_all.deb

Library dependencies:
- libpq5, libicu70, liblz4-1, libzstd1, libldap-2.5-0, libllvm15, libjson-perl

Note: Common system libraries (libc6, libssl3, etc.) are already in the gitpod/workspace-full base image.

## Configuration

PostgreSQL is configured with trust authentication for local development:
- Listens on all addresses
- Trust authentication for all connections
- Data directory: /var/lib/postgresql/data

## Offline Installation

This feature works completely offline:
- No `apt-get update` required
- No internet access needed during installation
- All dependencies included as local .deb files
