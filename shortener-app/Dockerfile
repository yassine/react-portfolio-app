FROM mhart/alpine-node:12.20.1

ADD app /usr/server/app

ADD server /app-server
WORKDIR /app-server
RUN npm install
ADD app /app-server/app

EXPOSE 8080

CMD ["node", "index.js"]
