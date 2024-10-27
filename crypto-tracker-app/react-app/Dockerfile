# Use official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /react-app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@latest -g --silent

# add app
COPY . .