package com.github.yassine.shortener.dao

import java.security.MessageDigest
import kotlin.math.abs

object HashService {

  private val randomBuffer: ThreadLocal<ByteArray> = ThreadLocal.withInitial { ByteArray(4) { 0 } }

  private val table = listOf(
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
    'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
    'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
    'W', 'X', 'Y', 'Z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9'
  ).map { it.toByte() }

  fun hash(data: ByteArray, offset: Int, len: Int): ByteArray
    = MessageDigest.getInstance("SHA-256")
        .apply { update(randomBuffer.get().also { java.util.Random().nextBytes(it) }) }
        .apply { update(data, offset, len) }
        .digest()

  fun encode(data: ByteArray) = data.map {
    table[abs(it.toInt()) % table.size]
  }

}
