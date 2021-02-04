package com.github.yassine.shortener.service

import com.github.yassine.shortener.dao.UrlDao
import com.google.inject.Inject
import com.google.inject.Singleton
import io.undertow.servlet.handlers.DefaultServlet
import mu.KotlinLogging
import java.io.IOException
import java.lang.Exception
import java.net.URL
import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Singleton
class StordServlet : DefaultServlet() {

  @Inject
  lateinit var urlDao: UrlDao

  private val logger = KotlinLogging.logger {}

  @Throws(ServletException::class, IOException::class)
  override fun doGet(req: HttpServletRequest, resp: HttpServletResponse) {
    req.pathInfo.split("/")
      .takeIf { it.size == 2 }
      ?.let { it[1] }
      ?.let { key ->
        urlDao.get(key)?.also {
          resp.writer.write("\"")
          resp.writer.write(it)
          resp.writer.write("\"")
          resp.writer.flush()
        } ?: resp.also {
          it.status = 404
          it.writer.write("\"")
          it.writer.write("Not Found")
          it.writer.write("\"")
          it.writer.flush()
        }
      }
      ?: resp.also {
        it.status = 500
        resp.writer.write("\"")
        it.writer.write("Bad request path")
        resp.writer.write("\"")
        it.writer.flush()
      }
  }

  override fun doPost(req: HttpServletRequest?, resp: HttpServletResponse) {

    req?.reader?.lines()
      ?.limit(1)
      ?.filter {
        try {
          URL(it)
          return@filter true
        } catch (e: Exception) {
          logger.error(e.message)
          return@filter false;
        }
      }
      ?.map { urlDao.store(it) }
      ?.forEach { hash ->
        hash?.also {
          resp.writer.write("\"")
          resp.writer.write(it)
          resp.writer.write("\"")
          resp.writer.flush()
        } ?: resp.also {
          // no available key in the key space
          it.status = 500
          resp.writer.write("\"")
          it.writer.write("Out of capacity")
          resp.writer.write("\"")
          it.writer.flush()
        }
      }
      ?: resp.also {
        it.status = 500
        resp.writer.write("\"")
        it.writer.write("No URL or Bad URL")
        resp.writer.write("\"")
        it.writer.flush()
      }

  }

}
