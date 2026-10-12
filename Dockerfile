FROM node:22-alpine

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY index.html calculations.js server.js ./
COPY data ./data

ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
