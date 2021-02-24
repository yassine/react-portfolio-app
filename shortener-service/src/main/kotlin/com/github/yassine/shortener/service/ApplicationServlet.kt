package com.github.yassine.shortener.service

import com.github.yassine.shortener.dao.UrlDao
import com.google.inject.Inject
import com.google.inject.Singleton
import io.undertow.servlet.handlers.DefaultServlet
import org.apache.commons.validator.routines.UrlValidator
import java.io.IOException
import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

const val URL_MAX_SIZE = 16 * 1024 // url max length (exclusive)
val QUOTE = "\"".toByteArray()

@Singleton
class ApplicationServlet @Inject constructor(private val urlDao: UrlDao, private val validator: UrlValidator): DefaultServlet() {

  private val buffer: ThreadLocal<ByteArray> = ThreadLocal.withInitial { ByteArray(URL_MAX_SIZE) { 0 } }

  @Throws(ServletException::class, IOException::class)
  override fun doGet(req: HttpServletRequest, resp: HttpServletResponse) {
    req.pathInfo.split("/")
      .takeIf { it.size == 2 }
      ?.let { it[1].toByteArray() }
      ?.let { key ->
        urlDao.get(key)?.also { writeString(it, resp, OK_STATUS) }
          ?: resp.also { writeString(NOT_FOUND, resp, NOT_FOUND_STATUS) }
      }
      ?: resp.also {
        writeString(BAD_REQUEST, resp, BAD_REQUEST_STATUS)
      }
  }

  override fun doPost(req: HttpServletRequest, resp: HttpServletResponse) {
    val urlBuffer = buffer.get()
    val urlLen    = req.inputStream.readLine(urlBuffer, 0, URL_MAX_SIZE)
    req.inputStream.close()
    urlBuffer.takeUnless { urlLen < 1 || urlLen == URL_MAX_SIZE }
      ?.apply {
        takeIf { validator.isValid(String(urlBuffer, 0, urlLen)) }
          ?.also {
            urlDao.store(it, 0, urlLen)
              ?.also { token -> writeString(token, resp, CREATED_STATUS) }
              ?: writeString(OOC, resp, OOC_STATUS)
          }
          ?: writeString(BAD_URL, resp, BAD_URL_STATUS)
      }
      ?: urlLen.takeIf { it == URL_MAX_SIZE }
          ?.apply { writeString(URL_TOO_LONG, resp, URL_TOO_LONG_STATUS) }
          ?: writeString(NO_URL, resp, NO_URL_STATUS)
  }

  private fun writeString(value: ByteArray, resp: HttpServletResponse, status: Int) {
    resp.status = status
    resp.outputStream.write(QUOTE)
    resp.outputStream.write(value)
    resp.outputStream.write(QUOTE)
    resp.outputStream.flush()
  }

}
