
FROM node:20-alpine3.19

# Update the OS packages to the latest security patches
RUN apk update && apk upgrade && \
    apk add --no-cache git

WORKDIR /app

# Copy the Backend folder specifically
COPY Backend/package*.json ./
RUN npm install

# Copy the source code
COPY Backend/ .

EXPOSE 8080

CMD ["npm", "start"]