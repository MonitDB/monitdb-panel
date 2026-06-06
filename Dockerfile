FROM node:18-alpine

WORKDIR /opt/app

RUN adduser -S app

COPY package.json yarn.lock ./
RUN yarn install --network-timeout 600000 --mutex network

COPY . .

RUN yarn add pm2

RUN chown -R app /opt/app

USER app

EXPOSE 3000

CMD ["npm", "run", "pm2"]

