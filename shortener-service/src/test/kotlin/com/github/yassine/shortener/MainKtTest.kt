package com.github.yassine.shortener

import com.github.yassine.shortener.service.*
import com.google.common.io.ByteStreams.copy
import com.google.common.io.Files
import io.restassured.module.kotlin.extensions.Extract
import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.Request
import org.awaitility.Awaitility.await
import org.spekframework.spek2.Spek
import org.spekframework.spek2.style.specification.describe
import strikt.api.expect
import strikt.assertions.isTrue
import java.io.File
import java.io.FileOutputStream
import java.util.concurrent.TimeUnit


object ApiTest: Spek({

  val port = 8888

  describe("when a i request a non existing key from the api") {

    it("i should get a Not found response code/message") {
      Given {
        port(port)
      } When {
        get("/")
      } Then {
        statusCode(NOT_FOUND_STATUS)
      } Extract {
        val message = body().asString()?.stripQuotes()
        expect { that(message == String(NOT_FOUND)).isTrue() }
      }
    }

  }

  group("when a i post a url to from the api") {
    val key = "http://www.google.com"
    var hash: String? = null

    test("i should get a short hash from the api") {
      Given {
        port(port)
        body(key)
      } When {
        post("/")
      } Then {
        statusCode(201)
      } Extract {
        hash = body().asString()
        expect { that(hash != null).isTrue() }
      }
    }

    test("i should get the original url if use that hash") {
      Given {
        port(port)
      } When {
        get("/${hash?.replace("\"", "")}")
      } Then {
        statusCode(200)
      } Extract {
        val ret = this.body().asString()?.stripQuotes()
        expect { that(ret == key).isTrue() }
      }
    }

    test("i should get a different key if we send the same url again (multi users)") {
      Given {
        port(port)
        body(key)
      } When {
        post("/")
      } Then {
        statusCode(201)
      } Extract {
        expect { that(hash != body().asString()).isTrue() }
      }
    }

  }

  describe("when i post an invalid url") {

    it("i should get an error if I post an invalid URL") {
      Given {
        port(port)
        body("blah blah blah")
      } When {
        post("/")
      } Then {
        statusCode(BAD_URL_STATUS)
      } Extract {
        val message = body().asString()?.stripQuotes()
        expect { that(message == String(BAD_URL)).isTrue() }
      }
    }

    it("i should get an error if I post a too long URL") {
      Given {
        port(port)
        body(String(ByteArray(URL_MAX_SIZE)))
      } When {
        post("/")
      } Then {
        statusCode(URL_TOO_LONG_STATUS)
      } Extract {
        val message = body().asString()?.stripQuotes()
        expect { that(message == String(URL_TOO_LONG)).isTrue() }
      }
    }

    it("i should get an error if I post no URL") {
      Given {
        port(port)
      } When {
        post("/")
      } Then {
        statusCode(NO_URL_STATUS)
      } Extract {
        val message = body().asString()?.stripQuotes()
        expect { that(message == String(NO_URL)).isTrue() }
      }
    }

    it("i should get an error if I request an invalid path") {
      Given {
        port(port)
      } When {
        get("/invalid/path")
      } Then {
        statusCode(BAD_REQUEST_STATUS)
      } Extract {
        val message = body().asString()?.stripQuotes()
        expect { that(message == String(BAD_REQUEST)).isTrue() }
      }
    }
  }

  beforeGroup {
    //start the server in a new thread
    GlobalScope.launch { // launch a new coroutine in background and continue
      val dir    = Files.createTempDir()
      val config = File(dir, "config.yaml")
      copy(ApiTest::class.java.getResourceAsStream("/test-config.yaml"), FileOutputStream(config))
      main(arrayOf(config.absolutePath))
    }

    // wait for it to be online
    await()
      .pollInterval(1, TimeUnit.SECONDS)
      .atMost(5, TimeUnit.SECONDS)
      .ignoreExceptions()
      .untilAsserted {
        OkHttpClient.Builder().build()
          .newCall(
            Request.Builder()
              .header("Accept", "application/json")
              .url("http://127.0.0.1:${port}/should-not-exist")
              .get().build()
          )
          .execute()
      }
  }

  afterGroup {
    server?.stop()
  }

})

fun String.stripQuotes(): String
  = substring(1, length - 1)
