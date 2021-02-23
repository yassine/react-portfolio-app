package com.github.yassine.shortener.core

import com.github.yassine.shortener.ShortenerConfiguration
import com.google.inject.AbstractModule

class ShortenerModule(private val config: ShortenerConfiguration): AbstractModule() {

  override fun configure() {
    install(ServletGuiceModule())
    install(DbModule())
    install(ConfigurationModule(config))
  }

}
