FROM node:18-alpine

WORKDIR /react-app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@latest -g --silent

COPY . .