FROM node:18

WORKDIR /usr/src/app
COPY package.json ./

RUN npm install

COPY . .
EXPOSE 4004
CMD [ "node", "index.js" ]
