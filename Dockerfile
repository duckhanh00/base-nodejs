FROM node:lts-alpine3.13

WORKDIR /index

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]