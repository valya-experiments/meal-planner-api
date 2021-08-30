# Based on the following article
# https://javascript.plainenglish.io/build-a-production-ready-node-express-api-with-docker-9a45443427a0

FROM node:14-alpine AS node

# Builder stage

FROM node AS builder

# Use /app as the CWD
WORKDIR /app

# Copy package.json and yarn.lock to /app
COPY package.json yarn.lock ./

# Install all dependencies
RUN yarn install

# Copy the rest of the code
COPY . .

# Invoke the build script to transpile code to js
RUN npm run build


# Final stage


FROM node AS final

# Update the system
RUN apk --no-cache -U upgrade

# Prepare a destination directory for js files
RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app

# Use /app as CWD
WORKDIR /home/node/app

# Install PM2
RUN npm i -g pm2

# Copy package.json and yarn.lock to /app
COPY package.json yarn.lock process.yml ./

# Switch to user node
USER node

# Install only production dependencies
RUN yarn install --production=true

# Copy js files and change ownership to user node
COPY --chown=node:node --from=builder /app/dist ./dist

# Open desired port
EXPOSE 3050

# Use PM2 to run the application as per config file
ENTRYPOINT ["pm2-runtime", "./process.yml"]
