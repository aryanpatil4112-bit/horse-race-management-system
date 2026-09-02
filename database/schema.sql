-- ============================================================
-- HORSE RACE MANAGEMENT SYSTEM - DATABASE SCHEMA DDL
-- Database: MySQL
-- Normalization: 1NF, 2NF, 3NF compliant
-- ============================================================

CREATE DATABASE IF NOT EXISTS horserace_db;
USE horserace_db;

-- Drop tables in reverse dependency order if re-initializing
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS races;
DROP TABLE IF EXISTS jockeys;
DROP TABLE IF EXISTS horses;
DROP TABLE IF EXISTS users;

-- 1. USERS TABLE
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'VIEWER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. HORSES TABLE
CREATE TABLE horses (
    horse_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. JOCKEYS TABLE
CREATE TABLE jockeys (
    jockey_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    experience INT NOT NULL, -- Experience in years
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. RACES TABLE
CREATE TABLE races (
    race_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    race_name VARCHAR(120) NOT NULL,
    race_date DATE NOT NULL,
    race_time TIME NOT NULL,
    location VARCHAR(120) NOT NULL,
    distance VARCHAR(30) NOT NULL, -- e.g., '1600m'
    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED, ONGOING, COMPLETED, CANCELLED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. REGISTRATIONS TABLE (Junction Table: Race <-> Horse <-> Jockey)
CREATE TABLE registrations (
    registration_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    race_id BIGINT NOT NULL,
    horse_id BIGINT NOT NULL,
    jockey_id BIGINT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'REGISTERED', -- REGISTERED, CANCELLED
    CONSTRAINT fk_reg_race FOREIGN KEY (race_id) REFERENCES races(race_id) ON DELETE CASCADE,
    CONSTRAINT fk_reg_horse FOREIGN KEY (horse_id) REFERENCES horses(horse_id) ON DELETE CASCADE,
    CONSTRAINT fk_reg_jockey FOREIGN KEY (jockey_id) REFERENCES jockeys(jockey_id) ON DELETE CASCADE,
    CONSTRAINT uk_race_horse UNIQUE (race_id, horse_id) -- Prevent duplicate horse registration in same race
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. RESULTS TABLE
CREATE TABLE results (
    result_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    race_id BIGINT NOT NULL,
    horse_id BIGINT NOT NULL,
    jockey_id BIGINT NOT NULL,
    position INT NOT NULL,
    finish_time VARCHAR(20) NOT NULL, -- e.g., '1:34.52'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_res_race FOREIGN KEY (race_id) REFERENCES races(race_id) ON DELETE CASCADE,
    CONSTRAINT fk_res_horse FOREIGN KEY (horse_id) REFERENCES horses(horse_id) ON DELETE CASCADE,
    CONSTRAINT fk_res_jockey FOREIGN KEY (jockey_id) REFERENCES jockeys(jockey_id) ON DELETE CASCADE,
    CONSTRAINT uk_race_position UNIQUE (race_id, position), -- Prevent duplicate positions in same race
    CONSTRAINT uk_race_horse_result UNIQUE (race_id, horse_id) -- One result record per horse in a race
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Useful Indexes for performance
CREATE INDEX idx_horses_status ON horses(status);
CREATE INDEX idx_jockeys_status ON jockeys(status);
CREATE INDEX idx_races_date ON races(race_date);
CREATE INDEX idx_races_status ON races(status);
