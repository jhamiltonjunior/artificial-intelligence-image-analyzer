CREATE DATABASE IF NOT EXISTS image_analyzer;

CREATE TABLE IF NOT EXISTS image_analyzer.customer (
    code CHAR(36) PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS image_analyzer.measure (
  code CHAR(36) PRIMARY KEY NOT NULL,
  type VARCHAR(5) NOT NULL,
  value INT NOT NULL,
  confirmed TINYINT(1) DEFAULT 0 NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  active TINYINT(1)  DEFAULT 1 NOT NULL,
  customer_id CHAR(36),
    FOREIGN KEY (customer_id) REFERENCES customer(code)
);

SELECT confirmed FROM measure WHERE measure.code = ?;

UPDATE measure SET confirmed = ?, value = ? WHERE measure.code = ?;

INSERT IGNORE INTO image_analyzer.customer (
  code,
  name
) VALUES (
  'f56fce1b-73d5-4b23-81d6-226791aa5fcc',
  'Jhon Doe'
);