package com.github.yassine.shortener.core

import com.github.yassine.shortener.ShortenerConfiguration
import com.google.inject.AbstractModule
import com.google.inject.Provides
import com.google.inject.Singleton

class ConfigurationModule(private val config: ShortenerConfiguration): AbstractModule() {

  @Provides @Singleton
  fun createConfig(): ShortenerConfiguration
    = config

}
