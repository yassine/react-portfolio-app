package com.github.yassine.shortener.core

import com.google.inject.AbstractModule

class ShortenerModule(private val configPath: String): AbstractModule() {
  override fun configure() {
    install(ServletGuiceModule())
    install(DbModule())
    install(ConfigurationModule(configPath))
  }
}