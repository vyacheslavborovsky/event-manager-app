FROM node:carbon

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./

RUN npm install

COPY src /app
COPY .env.* ./

EXPOSE 5555

CMD ["node", "./src/index.js"]
