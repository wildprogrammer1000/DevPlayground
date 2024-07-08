FROM node:lts

WORKDIR /node

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]