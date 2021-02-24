package com.github.yassine.shortener.dao

import org.spekframework.spek2.Spek
import org.spekframework.spek2.style.specification.describe
import strikt.api.expect
import java.util.regex.Pattern


object HashServiceTest : Spek({

  val hash = String(HashService.encode("key".toByteArray()))

  describe("when i ask to hash a key") {
    it("I should get a hash consisting only for UTF-8 encoded alpha-num characters ") {
      val pattern = Pattern.compile("^[0-9a-zA-Z]+$")
      expect { that(pattern.asPredicate().test(hash)) }
    }
  }

  describe("when i ask again to hash the same key") {
    it("I should get a different hash") {
      val hash2 = String(HashService.encode("key".toByteArray()))
      expect { that(hash != hash2) }
    }
  }

})
