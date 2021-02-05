package com.github.yassine.shortener.core

import com.github.yassine.shortener.ShortenerConfiguration
import com.github.yassine.shortener.dao.RocksDbUrlDao
import com.github.yassine.shortener.dao.UrlDao
import com.google.inject.AbstractModule
import com.google.inject.Provides
import com.google.inject.Singleton
import org.rocksdb.RocksDB

class DbModule: AbstractModule() {

  @Provides @Singleton
  fun dao(rocksDB: RocksDB): UrlDao
    = RocksDbUrlDao(rocksDB)

  @Provides @Singleton
  fun rocksDb(config: ShortenerConfiguration): RocksDB {
    RocksDB.loadLibrary()
    val rocksOptions: org.rocksdb.Options = org.rocksdb.Options()
      .also { it.setCreateIfMissing(true) }
    return RocksDB.open(rocksOptions, config.dbPath)
  }

}
