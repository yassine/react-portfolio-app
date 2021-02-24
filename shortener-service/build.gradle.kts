plugins {
  kotlin("jvm") version "1.4.20"
  id("com.palantir.docker") version "0.26.0"
  id("org.sonarqube") version "3.1.1"
  jacoco
}

group   = "yassine.assignments"
version = "0.1.0-SNAPSHOT"

repositories {
  mavenCentral()
  jcenter()
}

sonarqube {
  properties {
    property("sonar.verbose", "true")
    property("sonar.sourceEncoding", "UTF-8")
    property("sonar.projectKey", "shortener-service")
    property("sonar.coverage.jacoco.xmlReportPaths", "${buildDir}/reports/jacoco/test/jacocoTestReport.xml")
  }
}

docker {
  dependsOn(tasks.findByName("jar"))
  name = "yassine/shortener-service:0.1.0"
  setDockerfile(file("docker/Dockerfile"))
  files(tasks.findByName("jar")?.outputs, "config.yaml")
  pull(false)
  noCache(true)
}

dependencies {

  implementation("org.jetbrains.kotlin:kotlin-stdlib")
  implementation("io.undertow:undertow-core:2.2.3.Final")
  implementation("io.undertow:undertow-servlet:2.2.3.Final")
  implementation("org.rocksdb:rocksdbjni:6.6.4")
  implementation("com.google.inject:guice:5.0.0-BETA-1")
  implementation("com.google.inject.extensions:guice-servlet:5.0.0-BETA-1")
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.11.3")
  implementation("com.fasterxml.jackson.core:jackson-annotations:2.11.3")
  implementation("com.fasterxml.jackson.core:jackson-core:2.11.3")
  implementation("com.fasterxml.jackson.core:jackson-databind:2.11.3")
  implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-yaml:2.11.3")
  implementation("io.github.microutils:kotlin-logging-jvm:2.0.2")
  implementation("ch.qos.logback:logback-classic:1.2.3")
  implementation("commons-validator:commons-validator:1.7")

  testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.4.2")
  testImplementation("org.awaitility:awaitility:4.0.3")
  testImplementation("org.mockito:mockito-core:3.7.7")
  testImplementation("org.spekframework.spek2:spek-dsl-jvm:2.0.12")
  testImplementation("org.spekframework.spek2:spek-runner-junit5:2.0.12")
  testImplementation("io.strikt:strikt-core:0.23.7")
  testImplementation("com.squareup.okhttp3:okhttp:3.10.0")
  testImplementation("io.rest-assured:rest-assured:4.3.3")
  testImplementation("io.rest-assured:kotlin-extensions:4.3.3")

}

tasks {
  jar {
    manifest {
      attributes("Main-Class" to "com.github.yassine.shortener.MainKt")
    }
    from(configurations.runtimeClasspath.get()
      .map { it.takeIf { it.isDirectory } ?:  zipTree(it) })
  }

  test {
    useJUnitPlatform {
      includeEngines("spek2")
      include("**/*.class")
    }
    finalizedBy("jacocoTestReport")
  }
}

tasks.jacocoTestReport {
  reports {
    xml.isEnabled = true
  }
}

tasks.register("ci") {
  dependsOn(tasks.findByName("test"))
  finalizedBy("jacocoTestReport")
}

tasks.findByPath("dockerPrepare")?.apply {
  dependsOn("ci", "jar")
}

