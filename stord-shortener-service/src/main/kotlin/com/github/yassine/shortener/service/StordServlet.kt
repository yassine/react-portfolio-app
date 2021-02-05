package com.github.yassine.shortener.service

import com.github.yassine.shortener.dao.UrlDao
import com.google.inject.Inject
import com.google.inject.Singleton
import io.undertow.servlet.handlers.DefaultServlet
import mu.KotlinLogging
import java.io.IOException
import java.io.Writer
import java.lang.Exception
import java.net.URL
import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

const val NOT_FOUND   = "Not Found"
const val BAD_REQUEST = "Bad Request"
const val BAD_URL     = "No URL or Bad URL"
const val OOC         = "Out of capacity"
const val QUOTE       = "\""

@Singleton
class StordServlet @Inject constructor(private val urlDao: UrlDao): DefaultServlet() {

  private val logger = KotlinLogging.logger {}

  @Throws(ServletException::class, IOException::class)
  override fun doGet(req: HttpServletRequest, resp: HttpServletResponse) {
    req.pathInfo.split("/")
      .takeIf { it.size == 2 }
      ?.let { it[1] }
      ?.let { key ->
        urlDao.get(key)?.also {
          writeString(it, resp, 200)
        } ?: resp.also {
          writeString(NOT_FOUND, resp, 404)
        }
      }
      ?: resp.also {
        writeString(BAD_REQUEST, resp, 500)
      }
  }

  override fun doPost(req: HttpServletRequest?, resp: HttpServletResponse) {

    req?.reader?.lines()
      ?.limit(1)
      ?.filter(::isValidURL)
      ?.map(urlDao::store)
      ?.forEach { hash ->
        hash?.also {
          writeString(it, resp, 200)
        } ?: resp.also {
          // no available key, we're hitting in the key space limit
          writeString(OOC, resp, 500)
        }
      }
      ?: resp.also {
        writeString(BAD_URL, resp, 500)
      }

  }

  private fun writeString(value: String, resp: HttpServletResponse, status: Int) {
    resp.status = status
    // avoiding (purposely) string interpolation to not pollute the heap with a non necessary string
    resp.writer.write(QUOTE)
    resp.writer.write(value)
    resp.writer.write(QUOTE)
    resp.writer.flush()
  }

  private fun isValidURL(url: String): Boolean{
    return try {
      URL(url)
      true
    } catch (e: Exception) {
      logger.error(e.message)
      false
    }
  }

}
