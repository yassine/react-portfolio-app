#!/bin/sh
docker kill stord-shortener-app
docker kill stord-shortener-service
docker rm stord-shortener-app
docker rm stord-shortener-service
docker images | grep none | awk '{print $3}' | xargs docker rmi
docker image rm yassine/stord-shortener-service:0.1.0 yassine/stord-shortener-app:0.1.0
