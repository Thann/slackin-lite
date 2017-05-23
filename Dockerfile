FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY server.js package.json /usr/src/app/

# Install app dependencies
RUN npm install

EXPOSE 3000
CMD [ "node", "server" ]
