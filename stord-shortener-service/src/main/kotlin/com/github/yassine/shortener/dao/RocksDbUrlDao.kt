package com.github.yassine.shortener.dao

import com.github.yassine.shortener.dao.HashService.encode
import com.github.yassine.shortener.dao.HashService.hash
import com.google.inject.Inject
import mu.KotlinLogging
import org.rocksdb.RocksDB

const val MIN_HASH_LENGTH = 5

class RocksDbUrlDao @Inject constructor(private val rocksDB: RocksDB): UrlDao {

  private val logger = KotlinLogging.logger {}

  override fun store(url: ByteArray): ByteArray? {

    val key    = encode(hash(url))
    var len    = MIN_HASH_LENGTH
    var subKey = key.subList(0, len).toByteArray()
    var value  = rocksDB.get(subKey)

    /*
      Collisions handling: we basically handle collisions
      by increasing the hash length.
    */
    while (value != null && ++len < 33) {
      subKey = key.subList(0, len).toByteArray()
      value  = rocksDB.get(subKey)
    }

    if (len > MIN_HASH_LENGTH) {
      if (value == null) {
        logger.info { "hash collision resolved at length $len" }
      } else {
        logger.error { "out of hash key space" }
      }
    }


    return len.takeIf { it < 33 }
      ?.also { rocksDB.put(subKey, url) }
      ?.let { subKey }

  }

  override fun get(key: ByteArray): ByteArray?
    = rocksDB.get(key)

}
