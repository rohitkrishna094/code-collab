FROM node:10

WORKDIR /usr/src/app/api

COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "devRun"]