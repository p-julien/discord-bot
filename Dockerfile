FROM node:latest

ENV TZ=Europe/Paris

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install

COPY . /usr/src/bot
CMD ["npm", "run", "start"]