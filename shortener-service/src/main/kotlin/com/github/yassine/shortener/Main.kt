package com.github.yassine.shortener

import com.github.yassine.shortener.core.ConfigurationModule
import com.github.yassine.shortener.core.GuiceServletConfig
import com.github.yassine.shortener.service.ApplicationServlet
import com.google.inject.Guice
import com.google.inject.servlet.GuiceFilter
import io.undertow.Undertow
import io.undertow.servlet.api.FilterInfo
import org.xnio.Options
import javax.servlet.DispatcherType
import io.undertow.Handlers
import io.undertow.Handlers.redirect
import io.undertow.servlet.Servlets.defaultContainer
import io.undertow.servlet.Servlets.deployment
import io.undertow.servlet.api.ListenerInfo

const val CONFIG_FILE = "config.file"

var server: Undertow? = null

fun main(args: Array<String>) {
  val bootstrapModule = Guice.createInjector(ConfigurationModule(args[0]))
  val config = bootstrapModule.getInstance(ShortenerConfiguration::class.java)
  server = undertow(args[0], config.port).apply { start() }
}

fun undertow(config: String, port: Int): Undertow
  = Undertow.builder()
      .setSocketOption(Options.REUSE_ADDRESSES, true)
      .setSocketOption(Options.TCP_NODELAY, true)
      .setDirectBuffers(true)
      .setIoThreads(4)
      .setWorkerThreads(4)
      .setBufferSize(1024)
      .addHttpListener(port, "0.0.0.0")
      .setHandler(Handlers.path(redirect("/"))
        .addPrefixPath("/",
          defaultContainer()
            .addDeployment(
              deployment()
                .setClassLoader(ApplicationServlet::class.java.classLoader)
                .setContextPath("/")
                .setDeploymentName("shortener")
                .addServletContextAttribute(CONFIG_FILE, config)
                .addListener(ListenerInfo(GuiceServletConfig::class.java))
                .addFilter(FilterInfo("guice-filter", GuiceFilter::class.java))
                .addFilterUrlMapping("guice-filter", "/*", DispatcherType.REQUEST)
            ).apply { deploy() }
            .start()
        )
      ).build()


