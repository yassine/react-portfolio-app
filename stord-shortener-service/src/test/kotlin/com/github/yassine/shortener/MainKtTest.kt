package com.github.yassine.shortener

import com.google.common.io.ByteStreams.copy
import com.google.common.io.Files
import io.restassured.module.kotlin.extensions.Extract
import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import io.undertow.Undertow
import okhttp3.OkHttpClient
import okhttp3.Request
import org.awaitility.Awaitility
import org.spekframework.spek2.Spek
import org.spekframework.spek2.style.specification.describe
import strikt.api.expect
import strikt.assertions.isTrue
import java.io.File
import java.io.FileOutputStream
import java.util.concurrent.TimeUnit


object ApiTest: Spek({
  var server: Undertow? = null
  val port = 9080

  beforeGroup {
    //start the server in a new thread
    Thread {
      val dir    = Files.createTempDir()
      val config = File(dir, "config.yaml")
      ApiTest::class.java.getResourceAsStream("/test-config.yaml")
      copy(ApiTest::class.java.getResourceAsStream("/test-config.yaml"), FileOutputStream(config))
      server = undertow(config.absolutePath, port)
      server?.start()
    }.also {
      it.start()
    }
    // wait for it to be online
    Awaitility.await().ignoreExceptions()
      .pollInterval(1, TimeUnit.SECONDS)
      .atMost(60, TimeUnit.SECONDS)
      .untilAsserted {
        OkHttpClient.Builder().build()
          .newCall(
            Request.Builder()
              .header("Accept", "application/json")
              .url("http://localhost:9080/error")
              .get().build()
          )
          .execute()
      }

  }

  describe("when a i request a non existing key from the api") {

    it("i should get a 404 response code") {
      Given {
          port(9080)
      } When {
        get("/")
      } Then {
        statusCode(404)
      }
    }

  }


  group("when a i post a url to from the api") {
    val key = "http://www.google.com"
    var hash: String? = null

    test("i should get a short hash") {
      Given {
        port(9080)
        body(key)
      } When {
        post("/")
      } Then {
        statusCode(200)
      } Extract {
        hash = this.body().asString()
        expect { that(hash != null).isTrue() }
      }
    }

    test("i should get a short back the original url if use the hash") {
      Given {
        port(9080)
      } When {
        get("/${hash?.replace("\"", "")}")
      } Then {
        statusCode(200)
      } Extract {
        val ret = this.body().asString()?.replace("\"", "")
        expect { that(ret == key).isTrue() }
      }
    }

    test("i should get a different key if send the same url again (multi users)") {
      Given {
        port(9080)
        body(key)
      } When {
        post("/")
      } Then {
        statusCode(200)
      } Extract {
        expect { that(hash != body().asString()).isTrue() }
      }
    }

  }

  afterGroup {
    server?.stop()
  }

})
