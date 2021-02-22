pluginManagement {
  repositories {
    mavenCentral()
    maven {
      url = uri("https://plugins.gradle.org/m2/")
    }
    jcenter()
  }
}

rootProject.name = "shortener"

include("shortener-app")
include("shortener-app:app")
include("shortener-service")
include("shortener-deployment")

