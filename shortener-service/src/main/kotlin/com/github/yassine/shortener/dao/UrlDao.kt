package com.github.yassine.shortener.dao

interface UrlDao {
  fun store(url: ByteArray): ByteArray?
  fun get(key: ByteArray): ByteArray?
}
