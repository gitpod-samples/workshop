FROM gitpod/workspace-full

# Node.js and common tools are already included in the base image

# Install additional tools
RUN sudo apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && sudo apt-get -y install --no-install-recommends \
        jq \
        htop \
    && sudo apt-get clean -y \
    && sudo rm -rf /var/lib/apt/lists/*

# Download and install a tool from GitHub (example: lazydocker)
RUN curl -fsSL https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash
