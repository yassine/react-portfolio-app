package com.github.yassine.shortener

class ShortenerConfiguration(var dbPath: String = "/tmp/shortener-rocksdb", var port: Int = 8888)
