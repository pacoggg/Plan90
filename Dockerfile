FROM node:22-alpine

WORKDIR /app
COPY package.json ./
COPY server.js ./
COPY index.html manifest.json service-worker.js ./
COPY app-data.js app-main.js dashboard-time-v023.js ./
COPY styles-base.css styles-components.css mobile-fullwidth-v013.css mobile-scale-v014.css ./
COPY icons ./icons
COPY assets ./assets

ENV NODE_ENV=production PORT=3000 DATA_DIR=/data
EXPOSE 3000
VOLUME ["/data"]
USER node
CMD ["node", "server.js"]
