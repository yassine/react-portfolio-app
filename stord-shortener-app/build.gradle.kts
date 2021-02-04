plugins {
  id("com.github.node-gradle.node") version "2.2.4"
  id("com.palantir.docker") version "0.22.1"
}

group   = "yassine.assignments"
version = "0.1.0-SNAPSHOT"

tasks {

  node {
    version     = "12.16.3"
    npmVersion  = "6.14.11"
    yarnVersion = "1.22.5"
    download    = true
  }

  docker {
    name = "yassine/stord-shortener-app:0.1.0"
    setDockerfile(file("Dockerfile"))
    files(file("app"), file("server"))
    pull(false)
    noCache(true)
    copySpec.apply {
      from("./server") {
        include("**")
        exclude("node_modules/")
        into("server")
      }
      from("./app") {
        include("**")
        exclude("node_modules/")
        into("app")
      }
    }
  }

}

tasks.register<com.moowork.gradle.node.npm.NpmTask>("test") {
  setArgs(listOf("run", "test"))

}

