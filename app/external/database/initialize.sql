CREATE DATABASE IF NOT EXISTS image_analyzer;

CREATE TABLE IF NOT EXISTS image_analyzer.customers (
    code VARCHAR(36) PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS image_analyzer.measures (
  measure_uuid VARCHAR(36) PRIMARY KEY NOT NULL,
  measure_type VARCHAR(5) NOT NULL,
  measure_value INT NOT NULL,
  has_confirmed TINYINT(1) DEFAULT 0 NOT NULL,
  measure_datetime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  active TINYINT(1)  DEFAULT 1 NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  customer_id VARCHAR(36),
    FOREIGN KEY (customer_id) REFERENCES customer(code)
);

INSERT INTO measures (
  measure_uuid,
  measure_type,
  measure_value,
  has_confirmed,
  measure_datetime,
  image_url,
  customer_id
)
VALUES ('f56fce1b-73d5-4b23-81d6-226791aa5fcc', 'TEMP', 36, 1, '2021-09-01 12:00:00', 1, 'https://www.google.com', 'f56fce1b-73d5-4b23-81d6-226791aa5fcc');

INSERT IGNORE INTO image_analyzer.customers (
  code,
  name
) VALUES (
  'f56fce1b-73d5-4b23-81d6-226791aa5fcc',
  'Jhon Doe'
);