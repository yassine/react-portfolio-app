package com.github.yassine.shortener.dao

interface UrlDao {
  fun store(url: String): String?
  fun get(key: String): String?
}