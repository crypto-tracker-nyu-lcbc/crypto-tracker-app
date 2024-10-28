FROM node:20-alpine

WORKDIR /react-app

COPY public/ /react-app/public
COPY package.json /react-app
COPY package-lock.json /react-app

RUN npm install
