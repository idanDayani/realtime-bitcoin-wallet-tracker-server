    # Use an official Node.js runtime as a parent image
    FROM node:18-slim

    # Set the working directory in the container
    WORKDIR /usr/src/app

    # Copy package.json and package-lock.json first to leverage Docker layer caching
    COPY package*.json ./

    # Install app dependencies
    RUN npm install --omit=dev

    # Bundle app source
    COPY . .

    # Your app binds to port 8080, Render will automatically use it
    EXPOSE 8080

    # Define the command to run your app
    CMD [ "npm", "start" ]