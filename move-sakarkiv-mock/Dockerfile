FROM node:16.16.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install server dependencies:
RUN npm install --force

# Copy frontend code:
COPY ./client/package*.json /usr/src/app/client/

ENV NODE_ENV=production

# If you are building your code for production
# RUN npm install --only=production

# Install frondend dependencies:
RUN cd client && npm install --force

# Bundle app source
COPY . .

EXPOSE 8002

CMD [ "npm", "start" ]