plugins {
  id("com.palantir.docker-compose") version "0.26.0"
}

group   = "yassine.assignments"
version = "0.1.0-SNAPSHOT"

repositories {
  mavenCentral()
}

dockerCompose {
  setTemplate("docker-compose-template.yml")
  setDockerComposeFile("./build/docker-compose.yml")
}

tasks.findByPath("dockerComposeUp")?.apply {
  dependsOn(":shortener-app:docker")
  dependsOn(":shortener-service:docker")
  dependsOn("generateDockerCompose")
}
