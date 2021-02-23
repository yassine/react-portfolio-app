package com.github.yassine.shortener.service

import com.github.yassine.shortener.dao.UrlDao
import com.google.inject.Inject
import com.google.inject.Singleton
import io.undertow.servlet.handlers.DefaultServlet
import mu.KotlinLogging
import java.io.IOException
import java.net.URL
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
  private val buffer: ThreadLocal<ByteArray> = ThreadLocal.withInitial { ByteArray(16 * 1024) { 0 } }

  @Throws(ServletException::class, IOException::class)
  override fun doGet(req: HttpServletRequest, resp: HttpServletResponse) {
    req.pathInfo.split("/")
      .takeIf { it.size == 2 }
      ?.let { it[1].toByteArray() }
      ?.let { key ->
        urlDao.get(key)?.also { writeString(it, resp, 200) }
          ?: resp.also { writeString(NOT_FOUND, resp, 404) }
      }
      ?: resp.also {
        writeString(BAD_REQUEST, resp, 500)
      }
  }

  override fun doPost(req: HttpServletRequest, resp: HttpServletResponse) {
    val urlBuffer = buffer.get()
    val urlLen    = req.inputStream.readLine(urlBuffer, 0, urlBuffer.size)
    req.inputStream.close()
    urlBuffer.takeUnless { urlLen < 1 }
      ?.also { it ->
        it.takeIf { isValidURL(String(urlBuffer, 0, urlLen), resp) }
          ?.also {
            urlDao.store(it, 0, urlLen)
              ?.also { token -> writeString(token, resp, 200) }
              ?: writeString(OOC, resp, 500)
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
