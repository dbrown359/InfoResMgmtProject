-- Account-a-Day complete fresh-install schema. Do not import into an existing populated database.
-- Account-a-Day Database Schema
-- CINS 5301 Database Project
-- Academic Accountability Platform

-- Create Database
CREATE DATABASE IF NOT EXISTS account_a_day;

USE account_a_day;

-- Table 1: Users
-- Stores customer/student and instructor accounts

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,

    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    phone VARCHAR(20),

    role ENUM('customer', 'instructor') NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table 2: Goals
-- Stores academic goals created by students

CREATE TABLE IF NOT EXISTS goals (
    goal_id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    target_hours DECIMAL(5,2) NOT NULL,
    duration VARCHAR(40) NOT NULL DEFAULT '30 Days',
    coach_id INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_goal_hours
        CHECK (target_hours > 0),

    INDEX idx_goal_coach (coach_id),
    CONSTRAINT fk_goal_coach FOREIGN KEY (coach_id) REFERENCES users(user_id) ON DELETE SET NULL,

    CONSTRAINT fk_goal_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 3: Provider Schedules
-- Stores instructors' weekly availability

CREATE TABLE IF NOT EXISTS provider_schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,

    provider_id INT NOT NULL,

    day_of_week ENUM(
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ) NOT NULL,

    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_schedule_time
        CHECK (end_time > start_time),

    CONSTRAINT fk_schedule_provider
        FOREIGN KEY (provider_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 4: Appointments
-- Stores student bookings with instructors

CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT NOT NULL,
    provider_id INT NOT NULL,
    goal_id INT NOT NULL,

    appointment_date DATE NOT NULL,

    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    status ENUM(
        'pending',
        'confirmed',
        'completed',
        'cancelled',
        'declined'
    ) NOT NULL DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_appointment_time
        CHECK (end_time > start_time),

    CONSTRAINT fk_appointment_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_appointment_provider
        FOREIGN KEY (provider_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_appointment_goal
        FOREIGN KEY (goal_id)
        REFERENCES goals(goal_id),

    INDEX idx_provider_booking (
        provider_id,
        appointment_date,
        start_time,
        end_time
    )
) ENGINE=InnoDB;

-- Table 5: Reviews
-- Stores ratings and comments after completed sessions

CREATE TABLE IF NOT EXISTS reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,

    appointment_id INT NOT NULL UNIQUE,

    customer_id INT NOT NULL,
    provider_id INT NOT NULL,

    rating TINYINT NOT NULL,

    comment TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_review_rating
        CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT fk_review_appointment
        FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id),

    CONSTRAINT fk_review_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_review_provider
        FOREIGN KEY (provider_id)
        REFERENCES users(user_id)
) ENGINE=InnoDB;

-- Additional tables used by the PHP API and the current dashboard
CREATE TABLE IF NOT EXISTS milestones (
    milestone_id INT AUTO_INCREMENT PRIMARY KEY,
    goal_id INT NOT NULL,
    task_text VARCHAR(255) NOT NULL,
    priority ENUM('Low','Medium','High') NOT NULL DEFAULT 'Medium',
    status ENUM('Planned','Completed') NOT NULL DEFAULT 'Planned',
    CONSTRAINT fk_milestone_goal FOREIGN KEY (goal_id) REFERENCES goals(goal_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    message_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_message_recipient FOREIGN KEY (recipient_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INT PRIMARY KEY,
    plan VARCHAR(100) NOT NULL DEFAULT 'No plan selected',
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Verify Database Tables
SHOW TABLES;