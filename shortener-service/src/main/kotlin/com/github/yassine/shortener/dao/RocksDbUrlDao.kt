package com.github.yassine.shortener.dao

import com.github.yassine.shortener.dao.HashService.encode
import com.github.yassine.shortener.dao.HashService.hash
import com.google.inject.Inject
import mu.KotlinLogging
import org.rocksdb.RocksDB

const val MIN_HASH_LENGTH = 5

class RocksDbUrlDao @Inject constructor(private val rocksDB: RocksDB): UrlDao {

  private val logger = KotlinLogging.logger {}

  override fun store(url: ByteArray, offset: Int, length: Int): ByteArray? {
    val key     = encode(hash(url, offset, length))
    var hashLen = MIN_HASH_LENGTH
    var value   = rocksDB.get(key, 0, hashLen)

    /*
      Collisions handling: we basically handle collisions
      by increasing the hash length.
    */
    while (value != null && ++hashLen < 33)
      value = rocksDB.get(key, 0, hashLen)

    if (hashLen > MIN_HASH_LENGTH) {
      if (value == null) {
        logger.info { "hash collision resolved at length $hashLen" }
      } else {
        logger.error { "out of hash key space" }
      }
    }

    return hashLen.takeIf { it < 33 }
      ?.also { rocksDB.put(key, 0, hashLen, url, offset, length) }
      ?.let { key.copyOfRange(0, hashLen) }
  }

  override fun store(url: ByteArray): ByteArray?
    = store(url, 0, url.size)

  override fun get(key: ByteArray): ByteArray?
    = rocksDB.get(key)

}
