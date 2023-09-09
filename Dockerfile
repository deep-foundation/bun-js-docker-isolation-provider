FROM node:18

COPY bun-install.sh .
COPY package.json .
COPY index.js .
COPY index.js.map .
COPY index.ts .
COPY node_modules ./node_modules
COPY imports ./imports

RUN apt-get update
RUN apt-get install ffmpeg -y

RUN chmod +x /app/bun-install.sh

CMD ["bun-install.sh"]

ENTRYPOINT ["node", "index.js"]