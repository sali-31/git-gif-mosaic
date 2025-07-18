FROM node:20-slim

# Install ffmpeg, git, jq and required dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /github/workspace

# The GitHub Actions runner will mount the repository here
# No need to copy files as GitHub Actions handles that