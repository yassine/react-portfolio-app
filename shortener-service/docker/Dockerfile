FROM openjdk:12-alpine
ADD shortener-service-0.1.0-SNAPSHOT.jar /usr/shortener.jar
ADD config.yaml /usr/shortener-config.yaml
RUN apk update && \
    apk add libstdc++
EXPOSE 8888
CMD ["java", "-jar", "/usr/shortener.jar", "/usr/shortener-config.yaml"]
