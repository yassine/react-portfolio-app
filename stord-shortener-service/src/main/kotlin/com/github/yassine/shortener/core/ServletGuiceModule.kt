package com.github.yassine.shortener.core

import com.github.yassine.shortener.service.StordServlet
import com.google.inject.servlet.ServletModule

class ServletGuiceModule: ServletModule() {

  override fun configureServlets() {
    filter("/*").through(StordFilter::class.java)
    serve("/*").with(StordServlet::class.java)
  }

}