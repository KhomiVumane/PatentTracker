-- TrackIP Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS trackip CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE trackip;

-- ─── PATENTS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patents (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patent_number VARCHAR(30)  NOT NULL UNIQUE,
  title         VARCHAR(50) NOT NULL,
  owner         VARCHAR(30) NOT NULL,
  filing_date   DATE         NOT NULL,
  status        ENUM('Active','Pending','Expired') NOT NULL DEFAULT 'Pending',
  category      ENUM('Utility','Design','Plant','Provisional') NOT NULL DEFAULT 'Utility',
  abstract      TEXT,
  keywords      VARCHAR(512),
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_owner       (owner),
  INDEX idx_status      (status),
  INDEX idx_filing_date (filing_date),
  FULLTEXT idx_ft_patent (title, abstract, keywords)
) ENGINE=InnoDB;

-- ─── TRADEMARKS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trademarks (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  trademark_number VARCHAR(30)  NOT NULL UNIQUE,
  name             VARCHAR(50) NOT NULL,
  owner            VARCHAR(20) NOT NULL,
  filing_date      DATE         NOT NULL,
  status           ENUM('Active','Pending','Expired') NOT NULL DEFAULT 'Pending',
  goods_services   TEXT,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tm_owner  (owner),
  INDEX idx_tm_status (status),
  FULLTEXT idx_ft_tm  (name, goods_services)
) ENGINE=InnoDB;

-- ─── USERS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(50) NOT NULL,
  display_name  VARCHAR(50),
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─── WATCHLIST ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS watchlist (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  item_type   ENUM('patent','trademark') NOT NULL,
  item_id     INT UNSIGNED NOT NULL,
  notes       TEXT,
  added_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_watch (user_id, item_type, item_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── SEARCH HISTORY ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS search_history (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED,
  query       VARCHAR(500) NOT NULL,
  search_type ENUM('patent','trademark') NOT NULL,
  result_count INT UNSIGNED DEFAULT 0,
  searched_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ─── FILING TRENDS (cache table) ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS filing_trends (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category    VARCHAR(100) NOT NULL,
  year        SMALLINT UNSIGNED NOT NULL,
  month       TINYINT UNSIGNED NOT NULL CHECK (month BETWEEN 1 AND 12),
  patent_count INT UNSIGNED DEFAULT 0,
  tm_count    INT UNSIGNED DEFAULT 0,
  UNIQUE KEY uq_trend (category, year, month)
) ENGINE=InnoDB;
