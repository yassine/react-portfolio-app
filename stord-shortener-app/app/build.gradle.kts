plugins {
  id("com.github.node-gradle.node") version "2.2.4"
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

}

tasks.register<com.moowork.gradle.node.npm.NpmTask>("ci") {
  dependsOn(tasks.findByName("yarn"))
  setArgs(listOf("run", "ci"))

}
