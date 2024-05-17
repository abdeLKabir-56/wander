FROM node:18.13.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Bundle app source
COPY . .

EXPOSE 5000
CMD [ "node", "app.js" ]
