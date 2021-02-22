package com.github.yassine.shortener.service

import com.github.yassine.shortener.dao.UrlDao
import com.google.inject.Inject
import com.google.inject.Singleton
import io.undertow.servlet.handlers.DefaultServlet
import mu.KotlinLogging
import java.io.IOException
import java.net.URL
import java.util.stream.Collectors
import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

val NOT_FOUND   = "Not Found".toByteArray()
val BAD_REQUEST = "Bad Request".toByteArray()
val NO_URL      = "No URL".toByteArray()
val BAD_URL     = "Bad URL".toByteArray()
val OOC         = "Out of capacity".toByteArray()
val QUOTE       = "\"".toByteArray()

@Singleton
class ApplicationServlet @Inject constructor(private val urlDao: UrlDao): DefaultServlet() {

  private val logger = KotlinLogging.logger {}

  @Throws(ServletException::class, IOException::class)
  override fun doGet(req: HttpServletRequest, resp: HttpServletResponse) {
    req.pathInfo.split("/")
      .takeIf { it.size == 2 }
      ?.let { it[1].toByteArray() }
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

  override fun doPost(req: HttpServletRequest, resp: HttpServletResponse) {

    val lines = req.reader.lines().collect(Collectors.toList())
    lines.takeUnless { it.isEmpty() }
      ?.asSequence()
      ?.filter{ isValidURL(it, resp) }
      ?.take(1)
      ?.map { it.toByteArray() }
      ?.map(urlDao::store)
      ?.forEach { hash ->
        hash?.also {
          writeString(it, resp, 200)
        } ?: resp.also {
          // no available key, we're hitting in the key space limit
          writeString(OOC, resp, 500)
        }
      } ?: writeString(NO_URL, resp, 500)

  }

  private fun writeString(value: ByteArray, resp: HttpServletResponse, status: Int) {
    resp.status = status
    resp.outputStream.write(QUOTE)
    resp.outputStream.write(value)
    resp.outputStream.write(QUOTE)
    resp.outputStream.flush()
  }

  private fun isValidURL(url: String, resp: HttpServletResponse): Boolean {
    return try {
      URL(url)
      true
    } catch (e: Exception) {
      writeString(BAD_URL, resp, 500)
      logger.error(e.message)
      false
    }
  }

}
