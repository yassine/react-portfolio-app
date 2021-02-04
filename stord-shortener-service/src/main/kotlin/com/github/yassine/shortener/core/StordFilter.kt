package com.github.yassine.shortener.core

import com.google.inject.Singleton
import mu.KotlinLogging
import java.io.IOException
import javax.servlet.*
import javax.servlet.http.HttpFilter
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Singleton
class StordFilter : HttpFilter() {

  private val logger = KotlinLogging.logger {}

  @Throws(IOException::class, ServletException::class)
  override fun doFilter(req: HttpServletRequest?, res: HttpServletResponse?, chain: FilterChain?) {
    var start = System.nanoTime()
    try {
      res?.addHeader("Access-Control-Allow-Origin", "*")
      res?.addHeader("Content-Type", "application/json;charset=UTF-8")
      chain?.doFilter(req, res)
    } finally {
      start = System.nanoTime() - start
      logger.info("${req?.remoteHost} ${req?.method} ${req?.pathInfo ?: "/"} ${start / 1000 }")
    }
  }

}
