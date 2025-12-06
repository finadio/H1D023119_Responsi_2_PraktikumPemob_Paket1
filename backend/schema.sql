CREATE DATABASE IF NOT EXISTS inventaris_db;
USE inventaris_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS inventaris (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  harga INT NOT NULL,
  jumlah INT NOT NULL,
  tanggal_masuk DATE NOT NULL
);

-- Seed data
INSERT INTO inventaris (nama, harga, jumlah, tanggal_masuk) VALUES 
('Laptop ASUS ROG', 25000000, 5, '2023-11-20'),
('Monitor LG 24"', 2500000, 10, '2023-10-15');
