FROM node:18

# Install required packages
RUN apt-get update && \
apt-get install -y ffmpeg && \
apt-get clean && \
rm -rf /var/lib/apt/lists/*

# Install the 'bun' package globally and run the 'bun-install.sh' script
COPY bun-install.sh .

RUN chmod +x bun-install.sh && \
    ./bun-install.sh && \
    npm install -g bun

# Copy the necessary files into the container
COPY package.json .
COPY index.ts .
COPY node_modules ./node_modules
COPY imports/eval.ts ./imports/eval.ts

# Set the entrypoint to use the 'bun' command and run the 'index.js' file
ENTRYPOINT ["bun", "index.ts"]