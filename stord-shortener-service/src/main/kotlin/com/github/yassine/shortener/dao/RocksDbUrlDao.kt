package com.github.yassine.shortener.dao

import com.github.yassine.shortener.dao.HashService.encode
import com.github.yassine.shortener.dao.HashService.hash
import com.google.inject.Inject
import org.rocksdb.RocksDB

const val MIN_HASH_LENGTH = 5

class RocksDbUrlDao @Inject constructor(private val rocksDB: RocksDB): UrlDao {

  override fun store(url: String): String? {

    val key    = encode(hash(url.toByteArray()))
    var len    = MIN_HASH_LENGTH
    var subKey = key.substring(0, len).toByteArray()
    var value  = rocksDB.get(subKey)

    /*
      Collisions handling: we basically handling collisions
      by increasing the hash length.
    */
    while (value != null && ++len < 33) {
      subKey = key.substring(0, len).toByteArray()
      value  = rocksDB.get(subKey)
    }

    return len.takeIf { it < 33 }
      ?.also { rocksDB.put(subKey, url.toByteArray()) }
      ?.let { String(subKey, Charsets.UTF_8) }

  }

  override fun get(key: String): String?
    = rocksDB.get(key.toByteArray())
        ?.let { String(it, Charsets.UTF_8) }

}
