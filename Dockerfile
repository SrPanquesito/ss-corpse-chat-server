FROM node:18-alpine3.19

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

USER node

CMD [ "node", "index.js" ]
