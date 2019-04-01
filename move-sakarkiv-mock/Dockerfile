FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install server dependencies:
RUN npm install

# Copy frontend code:
COPY ./client /usr/src/app/client


# If you are building your code for production
# RUN npm install --only=production

# Install frondend dependencies:
RUN cd client && rm -rf node_modules/ && npm i && npm run build && cd ..

# Bundle app source
COPY . .

EXPOSE 8002

CMD [ "npm", "start" ]