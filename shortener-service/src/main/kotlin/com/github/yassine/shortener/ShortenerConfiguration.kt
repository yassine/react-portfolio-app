package com.github.yassine.shortener

data class ShortenerConfiguration(
  var dbPath   : String = "/tmp/shortener-rocksdb",
  var listener : ListenerConfiguration = ListenerConfiguration(),
  var threads  : ThreadsConfiguration = ThreadsConfiguration()
)

data class ListenerConfiguration(
  var bindAddress : String = "0.0.0.0",
  var bindPort    : Int    = 8888
)

data class ThreadsConfiguration(
  var workers: Int = 4,
  var io: Int = 4
)
