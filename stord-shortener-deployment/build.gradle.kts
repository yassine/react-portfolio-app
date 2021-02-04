plugins {
  id("com.palantir.docker-compose") version "0.22.1"
}

group   = "yassine.assignments"
version = "0.1.0-SNAPSHOT"

repositories {
  mavenCentral()
}

dockerCompose {
  setTemplate("docker-compose-template.yml")
  setDockerComposeFile("docker-compose.yml")
}

tasks.findByPath("dockerComposeUp")?.apply {
  dependsOn(":stord-shortener-app:docker")
  dependsOn(":stord-shortener-service:docker")
  dependsOn("generateDockerCompose")
}
