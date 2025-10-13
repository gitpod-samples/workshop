FROM gitpod/workspace-full

# Node.js and common tools are already included in the base image

# Install PostgreSQL and additional tools
RUN sudo apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && sudo apt-get -y install --no-install-recommends \
        postgresql \
        postgresql-contrib \
        jq \
        htop \
    && sudo apt-get clean -y \
    && sudo rm -rf /var/lib/apt/lists/*

# Configure PostgreSQL to allow local connections
RUN echo "local all postgres peer" | sudo tee /etc/postgresql/14/main/pg_hba.conf > /dev/null \
    && echo "local all all peer" | sudo tee -a /etc/postgresql/14/main/pg_hba.conf > /dev/null \
    && echo "host all all 127.0.0.1/32 trust" | sudo tee -a /etc/postgresql/14/main/pg_hba.conf > /dev/null \
    && echo "host all all ::1/128 trust" | sudo tee -a /etc/postgresql/14/main/pg_hba.conf > /dev/null

# Download and install a tool from GitHub (example: lazydocker)
RUN curl -fsSL https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash
