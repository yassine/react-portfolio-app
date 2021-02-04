FROM mhart/alpine-node:12.20.1
ADD app /usr/server/app

RUN apk update && \
    adduser -S -h /home/stord stord

ADD server /home/stord/app-server
ADD app /home/stord/app-build

WORKDIR /home/stord/app-build

RUN npm install && \
    npm run build

WORKDIR /home/stord/app-server
RUN npm install \
    && mv /home/stord/app-build/dist /home/stord/app-server/app

EXPOSE 8080

CMD ["node", "index.js"]
