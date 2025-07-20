FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

# Install additional dependencies for processing GIFs
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    ffmpeg \
    imagemagick \
    tig \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install ggc
RUN curl -sSL https://raw.githubusercontent.com/bmf-san/ggc/main/install.sh | bash

# Copy greeting script
COPY shell/greeting.sh /etc/profile.d/greeting.sh
RUN chmod +x /etc/profile.d/greeting.sh

# Create a simple bashrc that shows the greeting
RUN echo '#!/bin/bash' > /home/user/.bashrc && \
    echo '# Show greeting on interactive shell startup' >> /home/user/.bashrc && \
    echo 'if [[ $- == *i* ]] && [ -f /etc/profile.d/greeting.sh ]; then' >> /home/user/.bashrc && \
    echo '    source /etc/profile.d/greeting.sh' >> /home/user/.bashrc && \
    echo 'fi' >> /home/user/.bashrc && \
    echo '' >> /home/user/.bashrc && \
    echo '# Custom prompt' >> /home/user/.bashrc && \
    echo 'export PS1="\[\033[1;32m\]\u@terminal\[\033[0m\]:\[\033[1;34m\]\w\[\033[0m\]$ "' >> /home/user/.bashrc

# Install global npm packages
RUN su node -c "npm install -g typescript @astrojs/cli"