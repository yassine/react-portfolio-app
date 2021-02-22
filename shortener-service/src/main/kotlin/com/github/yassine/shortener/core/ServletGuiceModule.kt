package com.github.yassine.shortener.core

import com.github.yassine.shortener.service.ApplicationServlet
import com.google.inject.servlet.ServletModule

class ServletGuiceModule: ServletModule() {

  override fun configureServlets() {
    filter("/*").through(ApplicationFilter::class.java)
    serve("/*").with(ApplicationServlet::class.java)
  }

}
