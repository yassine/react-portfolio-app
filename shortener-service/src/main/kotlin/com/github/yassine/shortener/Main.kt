package com.github.yassine.shortener

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.github.yassine.shortener.core.GuiceServletConfig
import com.github.yassine.shortener.service.ApplicationServlet
import com.google.inject.servlet.GuiceFilter
import io.undertow.Handlers
import io.undertow.Handlers.redirect
import io.undertow.Undertow
import io.undertow.servlet.Servlets.defaultContainer
import io.undertow.servlet.Servlets.deployment
import io.undertow.servlet.api.FilterInfo
import io.undertow.servlet.api.ListenerInfo
import org.xnio.Options
import java.io.File
import javax.servlet.DispatcherType

const val CONFIG_INSTANCE = "config.instance"

var server: Undertow? = null

fun main(args: Array<String>) {
  server = undertow(
    ObjectMapper(YAMLFactory())
      .also { it.registerKotlinModule() }
      .readValue(File(args[0]), ShortenerConfiguration::class.java)
  ).apply { start() }
}

fun undertow(config: ShortenerConfiguration): Undertow
  = Undertow.builder()
      .setSocketOption(Options.REUSE_ADDRESSES, true)
      .setSocketOption(Options.TCP_NODELAY, true)
      .setDirectBuffers(true)
      .setIoThreads(config.threads.io)
      .setWorkerThreads(config.threads.workers)
      .setBufferSize(4 * 1024)
      .addHttpListener(config.listener.bindPort, config.listener.bindAddress)
      .setHandler(Handlers.path(redirect("/"))
        .addPrefixPath("/",
          defaultContainer()
            .addDeployment(
              deployment()
                .addFilter(FilterInfo("guice-filter", GuiceFilter::class.java))
                .addFilterUrlMapping("guice-filter", "/*", DispatcherType.REQUEST)
                .addListener(ListenerInfo(GuiceServletConfig::class.java))
                .addServletContextAttribute(CONFIG_INSTANCE, config)
                .setClassLoader(ApplicationServlet::class.java.classLoader)
                .setContextPath("/")
                .setDeploymentName("shortener")
            ).apply { deploy() }
            .start()
        )
      ).build()
