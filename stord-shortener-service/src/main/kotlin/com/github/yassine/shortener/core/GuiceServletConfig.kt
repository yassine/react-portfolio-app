package com.github.yassine.shortener.core

import com.github.yassine.shortener.CONFIG_FILE
import com.google.inject.Guice
import com.google.inject.Injector
import com.google.inject.servlet.GuiceServletContextListener
import javax.servlet.ServletContextEvent

class GuiceServletConfig: GuiceServletContextListener() {

  lateinit var configPath: String

  override fun contextInitialized(servletContextEvent: ServletContextEvent?) {
    configPath = servletContextEvent?.servletContext?.getAttribute(CONFIG_FILE) as String
    super.contextInitialized(servletContextEvent)
  }

  override fun getInjector(): Injector
    = Guice.createInjector(ShortenerModule(configPath))

}