pluginManagement {
  repositories {
    mavenCentral()
    maven {
      url = uri("https://plugins.gradle.org/m2/")
    }
    jcenter()
  }
}

rootProject.name = "stord-shortener"

include("stord-shortener-app:app")
include("stord-shortener-app")
include("stord-shortener-service")
include("stord-shortener-deployment")

