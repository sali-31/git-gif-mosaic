FROM golang:1.24-bullseye as ggc-builder

RUN apt-get update && apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends curl
    
# Install ggc
RUN curl -sSL https://raw.githubusercontent.com/bmf-san/ggc/main/install.sh | bash

FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

# Install additional dependencies for processing GIFs
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    ffmpeg \
    imagemagick \
    tig \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy greeting script
COPY shell/greeting.sh /etc/profile.d/greeting.sh
RUN chmod +x /etc/profile.d/greeting.sh

RUN useradd -ms /bin/bash codespace
RUN mkdir -p /home/codespace
RUN groupadd -g 1000 codespace && \
    usermod -u 1000 -g codespace codespace
RUN usermod -aG wheel codespace

# Create a simple bashrc that shows the greeting
RUN echo '#!/bin/bash' > /home/codespace/.bashrc && \
    echo '# Show greeting on interactive shell startup' >> /home/codespace/.bashrc && \
    echo 'if [[ $- == *i* ]] && [ -f /etc/profile.d/greeting.sh ]; then' >> /home/codespace/.bashrc && \
    echo '    source /etc/profile.d/greeting.sh' >> /home/codespace/.bashrc && \
    echo 'fi' >> /home/codespace/.bashrc && \
    echo '' >> /home/codespace/.bashrc && \
    echo '# Custom prompt' >> /home/codespace/.bashrc && \
    echo 'export PS1="\[\033[1;32m\]\u@terminal\[\033[0m\]:\[\033[1;34m\]\w\[\033[0m\]$ "' >> /home/codespace/.bashrc

run chown -R codespace:codespace /home/codespace

COPY --from=ggc-builder /root/.local/bin/ggc /usr/local/bin/ggc

# Install global npm packages
RUN su node -c "npm install -g typescript @astrojs/cli"

USER codespace
