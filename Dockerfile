FROM node:18

# Install required packages
RUN apt-get update && \
apt-get install -y ffmpeg && \
apt-get clean && \
rm -rf /var/lib/apt/lists/*

# Copy the necessary files into the container
COPY bun-install.sh .
COPY package.json .
COPY index.ts .
COPY node_modules ./node_modules
COPY imports/eval.ts ./imports/eval.ts

# Install the 'bun' package globally and run the 'bun-install.sh' script
RUN chmod +x bun-install.sh && \
    ./bun-install.sh && \
    npm install -g bun


# Set the entrypoint to use the 'bun' command and run the 'index.js' file
ENTRYPOINT ["bun", "index.ts"]