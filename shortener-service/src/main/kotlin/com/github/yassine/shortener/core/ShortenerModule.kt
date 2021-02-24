package com.github.yassine.shortener.core

import com.github.yassine.shortener.ShortenerConfiguration
import com.google.inject.AbstractModule
import com.google.inject.Provides
import com.google.inject.Singleton
import org.apache.commons.validator.routines.UrlValidator

class ShortenerModule(private val config: ShortenerConfiguration): AbstractModule() {

  override fun configure() {
    install(ServletGuiceModule())
    install(DbModule())
    install(ConfigurationModule(config))
  }

  @Provides @Singleton
  fun urlValidator()
    = UrlValidator(arrayOf("http", "https"))

}
