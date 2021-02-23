package com.github.yassine.shortener.core

import com.github.yassine.shortener.CONFIG_INSTANCE
import com.github.yassine.shortener.ShortenerConfiguration
import com.google.inject.Guice
import com.google.inject.Injector
import com.google.inject.servlet.GuiceServletContextListener
import javax.servlet.ServletContextEvent

class GuiceServletConfig: GuiceServletContextListener() {

  lateinit var config: ShortenerConfiguration

  override fun contextInitialized(servletContextEvent: ServletContextEvent) {
    config     = servletContextEvent.servletContext.getAttribute(CONFIG_INSTANCE) as ShortenerConfiguration
    super.contextInitialized(servletContextEvent)
  }

  override fun getInjector(): Injector
    = Guice.createInjector(ShortenerModule(config))

}
