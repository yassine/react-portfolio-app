#!/bin/sh
docker kill shortener-app
docker kill shortener-service
docker rm shortener-app
docker rm shortener-service
docker images | grep none | awk '{print $3}' | xargs docker rmi
docker image rm yassine/shortener-service:0.1.0 yassine/shortener-app:0.1.0
