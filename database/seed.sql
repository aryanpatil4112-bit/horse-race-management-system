-- ============================================================
-- HORSE RACE MANAGEMENT SYSTEM - DATABASE SEED DATA
-- Database: MySQL
-- ============================================================

USE horserace_db;

-- 1. SEED USERS (Passwords hashed using BCrypt for 'admin123', 'official123', 'viewer123')
-- BCrypt hash for admin123 / official123 / viewer123: $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd0P1R.aK858.Oaq
INSERT INTO users (name, email, password, role) VALUES
('System Administrator', 'admin@horserace.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd0P1R.aK858.Oaq', 'ADMIN'),
('Official Chief Referee', 'official@horserace.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd0P1R.aK858.Oaq', 'RACE_OFFICIAL'),
('Public Viewer User', 'viewer@horserace.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd0P1R.aK858.Oaq', 'VIEWER');

-- 2. SEED HORSES (10 realistic horses)
INSERT INTO horses (name, breed, age, gender, status) VALUES
('Thunder', 'Arabian', 5, 'Male', 'ACTIVE'),
('Storm', 'Thoroughbred', 4, 'Female', 'ACTIVE'),
('Lightning', 'Quarter Horse', 6, 'Male', 'ACTIVE'),
('Blaze', 'Thoroughbred', 3, 'Male', 'ACTIVE'),
('Champion', 'Arabian', 5, 'Male', 'ACTIVE'),
('Royal Star', 'Appaloosa', 4, 'Female', 'ACTIVE'),
('Silver Arrow', 'Thoroughbred', 6, 'Male', 'ACTIVE'),
('Dark Knight', 'Friesian', 7, 'Male', 'ACTIVE'),
('Golden Crest', 'Thoroughbred', 4, 'Female', 'ACTIVE'),
('Pegasus', 'Arabian', 5, 'Male', 'INACTIVE');

-- 3. SEED JOCKEYS (6 realistic jockeys)
INSERT INTO jockeys (name, age, experience, status) VALUES
('Rahul Sharma', 28, 8, 'ACTIVE'),
('Amit Verma', 32, 12, 'ACTIVE'),
('Vikram Singh', 25, 5, 'ACTIVE'),
('Rohan Mehta', 30, 9, 'ACTIVE'),
('Arjun Kapoor', 27, 6, 'ACTIVE'),
('Karan Patel', 35, 14, 'ACTIVE');

-- 4. SEED RACES (5 races: 2 Completed, 1 Ongoing, 2 Scheduled)
INSERT INTO races (race_name, race_date, race_time, location, distance, status) VALUES
('Pune Derby 2026', '2026-08-15', '15:30:00', 'Pune Racecourse', '1600m', 'COMPLETED'),
('Mumbai Classic', '2026-08-28', '16:00:00', 'Mahalaxmi Racecourse', '2000m', 'COMPLETED'),
('Delhi Cup', '2026-09-02', '14:00:00', 'Delhi Race Club', '1400m', 'ONGOING'),
('Bangalore Championship', '2026-09-15', '15:00:00', 'Bangalore Turf Club', '1800m', 'SCHEDULED'),
('Maharashtra Trophy', '2026-10-01', '16:30:00', 'Pune Racecourse', '2400m', 'SCHEDULED');

-- 5. SEED REGISTRATIONS (Race 1: Pune Derby, Race 2: Mumbai Classic, Race 3: Delhi Cup)
INSERT INTO registrations (race_id, horse_id, jockey_id, status) VALUES
-- Pune Derby (Race 1)
(1, 1, 1, 'REGISTERED'), -- Thunder + Rahul
(1, 2, 2, 'REGISTERED'), -- Storm + Amit
(1, 3, 3, 'REGISTERED'), -- Lightning + Vikram
(1, 4, 4, 'REGISTERED'), -- Blaze + Rohan

-- Mumbai Classic (Race 2)
(2, 5, 5, 'REGISTERED'), -- Champion + Arjun
(2, 6, 6, 'REGISTERED'), -- Royal Star + Karan
(2, 1, 2, 'REGISTERED'), -- Thunder + Amit
(2, 7, 1, 'REGISTERED'), -- Silver Arrow + Rahul

-- Delhi Cup (Race 3)
(3, 2, 3, 'REGISTERED'), -- Storm + Vikram
(3, 8, 4, 'REGISTERED'), -- Dark Knight + Rohan
(3, 3, 5, 'REGISTERED'), -- Lightning + Arjun

-- Bangalore Championship (Race 4 - Scheduled)
(4, 4, 1, 'REGISTERED'), -- Blaze + Rahul
(4, 9, 2, 'REGISTERED'); -- Golden Crest + Amit

-- 6. SEED RESULTS (For COMPLETED races: Pune Derby & Mumbai Classic)
-- Race 1: Pune Derby Results
INSERT INTO results (race_id, horse_id, jockey_id, position, finish_time) VALUES
(1, 1, 1, 1, '1:36.42'), -- 1st: Thunder (Rahul)
(1, 3, 3, 2, '1:37.15'), -- 2nd: Lightning (Vikram)
(1, 2, 2, 3, '1:37.89'), -- 3rd: Storm (Amit)
(1, 4, 4, 4, '1:38.50'); -- 4th: Blaze (Rohan)

-- Race 2: Mumbai Classic Results
INSERT INTO results (race_id, horse_id, jockey_id, position, finish_time) VALUES
(2, 5, 5, 1, '2:02.10'), -- 1st: Champion (Arjun)
(2, 1, 2, 2, '2:02.85'), -- 2nd: Thunder (Amit)
(2, 7, 1, 3, '2:03.40'), -- 3rd: Silver Arrow (Rahul)
(2, 6, 6, 4, '2:04.12'); -- 4th: Royal Star (Karan)
