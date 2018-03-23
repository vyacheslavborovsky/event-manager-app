FROM node:carbon

WORKDIR /website

RUN npm install -g serve
RUN npm install -g yarn
CMD serve -s build
EXPOSE 3000

COPY package*.json ./

RUN npm install
RUN yarn install

COPY . .

RUN npm run build
