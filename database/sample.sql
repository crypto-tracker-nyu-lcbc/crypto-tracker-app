CREATE TABLE IF NOT EXISTS "CoinsList" (
        "coin_id"       TEXT,
        "symbol"        TEXT,
        "name"  TEXT,
        PRIMARY KEY("coin_id")
);
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE IF NOT EXISTS "UserInfo" (
        "id"    INTEGER,
        "email" TEXT UNIQUE NOT NULL,
        "username"      TEXT UNIQUE NOT NULL,
        "password"      TEXT NOT NULL,
        "created_at"    DATETIME CURRENT_TIMESTAMP,
        "updated_at"    DATETIME CURRENT_TIMESTAMP,
        PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Wallets" (
        "wallet_id"     INTEGER,
        "user_id"       INTEGER,
        "wallet_address"        TEXT NOT NULL UNIQUE,
        "currency"      TEXT NOT NULL,
        "balance"       REAL DEFAULT 0.0,
        "created_at"    DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updated_at"    DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY("wallet_id" AUTOINCREMENT),
        FOREIGN KEY("user_id") REFERENCES "UserInfo"("id")
);
CREATE TABLE IF NOT EXISTS "Coin Market Data" (
        "id"    TEXT UNIQUE,
        "symbol "       TEXT,
        "name"  TEXT,
        "current_price" REAL,
        "market_cap "   REAL,
        "market_cap_rank"       INTEGER,
        "total_volume"  REAL,
        "high_24h"      REAL,
        "low_24h"       REAL,
        "price_change_24h"      REAL,
        "ath"   REAL,
        "ath_change_percentage" REAL,
        "atl"   REAL,
        "atl_change_percentage" REAL,
        "last_updated"  DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY("id")
);
