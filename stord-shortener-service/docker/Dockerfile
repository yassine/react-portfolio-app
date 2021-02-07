FROM openjdk:12-alpine
ADD stord-shortener-service-0.1.0-SNAPSHOT.jar /usr/stord-shortener.jar
ADD config.yaml /usr/stord-shortener-config.yaml
RUN apk update && \
    apk add libstdc++
EXPOSE 8888
CMD ["java", "-jar", "/usr/stord-shortener.jar", "/usr/stord-shortener-config.yaml"]
