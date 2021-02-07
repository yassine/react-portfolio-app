package com.github.yassine.shortener

import com.github.yassine.shortener.core.GuiceServletConfig
import com.github.yassine.shortener.service.StordServlet
import com.google.inject.servlet.GuiceFilter
import io.undertow.Undertow
import io.undertow.servlet.Servlets
import io.undertow.servlet.api.DeploymentInfo
import io.undertow.servlet.api.DeploymentManager
import io.undertow.servlet.api.FilterInfo
import org.xnio.Options
import javax.servlet.DispatcherType
import io.undertow.Handlers
import io.undertow.servlet.api.ListenerInfo

const val CONFIG_FILE = "config.file"

fun main(args: Array<String>) {
  undertow(args[0]).start()
}

fun undertow(config: String, port: Int = 8080): Undertow {

  val servletBuilder: DeploymentInfo = Servlets.deployment()
    .setClassLoader(StordServlet::class.java.classLoader)
    .setContextPath("/")
    .setDeploymentName("stord-shortener.war")
    .addServletContextAttribute(CONFIG_FILE, config)
    .addListener(ListenerInfo(GuiceServletConfig::class.java))
    .addFilter(FilterInfo("guice-filter", GuiceFilter::class.java))
    .addFilterUrlMapping("guice-filter", "/*", DispatcherType.REQUEST)

  val manager: DeploymentManager = Servlets.defaultContainer().addDeployment(servletBuilder)
  manager.deploy()

  val path = Handlers.path(Handlers.redirect("/"))
              .addPrefixPath("/", manager.start())

  return Undertow.builder()
    .setSocketOption(Options.REUSE_ADDRESSES, true)
    .setSocketOption(Options.TCP_NODELAY, true)
    .setDirectBuffers(true)
    .setIoThreads(4)
    .setWorkerThreads(4)
    .setBufferSize(1024)
    .addHttpListener(port, "0.0.0.0")
    .setHandler(path)
    .build()

}

