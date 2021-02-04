package com.github.yassine.shortener.core

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.github.yassine.shortener.ShortenerConfiguration
import com.google.inject.AbstractModule
import com.google.inject.Provides
import com.google.inject.Singleton
import java.io.File

class ConfigurationModule(private val configPath: String): AbstractModule() {

  @Provides @Singleton
  fun createConfig(mapper: ObjectMapper): ShortenerConfiguration
    = mapper.readValue(File(configPath), ShortenerConfiguration::class.java)

  @Provides @Singleton
  fun mapper()
    = ObjectMapper(YAMLFactory())
        .also { it.registerKotlinModule() }

}