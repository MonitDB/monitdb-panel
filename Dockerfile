<<<<<<< HEAD
FROM node:17.9.1-alpine
=======
FROM node:17.9.1
>>>>>>> cf8f01f459f45196a1d0e12d981c5f64221b69e0
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN adduser -S app
COPY . .
RUN npm install
RUN npm install --save pm2
RUN chown -R app /opt/app
USER app
EXPOSE 3000
CMD [ "npm", "run", "pm2" ]
