package com.github.yassine.shortener.dao

interface UrlDao {
  fun store(url: ByteArray): ByteArray?
  fun store(url: ByteArray, offset: Int, length: Int): ByteArray?
  fun get(key: ByteArray): ByteArray?
}
