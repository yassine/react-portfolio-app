package com.github.yassine.shortener.dao

import com.github.yassine.shortener.ShortenerConfiguration
import com.github.yassine.shortener.core.DbModule
import com.google.common.io.Files
import com.google.inject.AbstractModule
import com.google.inject.Guice
import org.spekframework.spek2.Spek
import org.spekframework.spek2.style.specification.describe
import strikt.api.expect

object UrlDaoTest : Spek({

  val injector = Guice.createInjector(TestModule(), DbModule())
  val target = injector.getInstance(UrlDao::class.java)

  describe("when i store a url") {

    it("i should be able recover it from the key associated with that url") {
      val key = target.store("hello".toByteArray()) ?: error("")
      val value = target.get(key)
      expect { that(key contentEquals value) }
    }

  }

  describe("when i ask for a non existing url key") {

    it("i should get null") {
      val nonExisting = target.get("hello".toByteArray())
      expect { that(nonExisting == null) }
    }

  }

})

class TestModule : AbstractModule() {
  override fun configure() {
    val dir = Files.createTempDir()
    val config = ShortenerConfiguration(dir.absolutePath)
    bind(ShortenerConfiguration::class.java).toInstance(config)
  }
}
