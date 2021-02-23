plugins {
  id("com.palantir.docker") version "0.26.0"
}

group   = "yassine.assignments"
version = "0.1.0-SNAPSHOT"

tasks {

  docker {
    name = "yassine/shortener-app:0.1.0"
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
      from("./app/dist") {
        include("**")
        into("app")
      }
    }
  }

}

tasks.findByPath("dockerPrepare")?.apply {
  dependsOn(":shortener-app:app:dist")
}
