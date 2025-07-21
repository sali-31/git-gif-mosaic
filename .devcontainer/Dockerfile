FROM mcr.microsoft.com/devcontainers/typescript-node:dev-22-bookworm

# Install additional dependencies for processing GIFs
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    ffmpeg \
    imagemagick \
    tig \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*