import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let db; // shared connection

async function connectDB() {
  try {
    // 1. connect without DB
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log("✅ Connected to MySQL server");

    // 2. create DB if not exists
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );

    console.log(`✅ Database '${process.env.DB_NAME}' ready`);

    // 3. connect to actual DB
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Connected to database");

    // 4. create tables
    await createUsersTable();
    await createOwnersTable();
    await createTurfsTable();
    await createSlotsTable();
    await createBookingsTable();
    await createNotificationLogsTable();
    await createOtpTable();

  } catch (err) {
    console.log("❌ DB Error:", err);
  }
}

// getter function (IMPORTANT)
function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
}

// helper function to create users table
async function createUsersTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        mobile VARCHAR(15) UNIQUE NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await db.query(query);

    console.log("✅ Users table ready");
  } catch (err) {
    console.log("❌ Error creating users table:", err);
  }
}

// helper function to create owners table 
async function createOwnersTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS owners (
        owner_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        mobile VARCHAR(15) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await db.query(query);

    console.log("✅ Owners table ready");
  } catch (err) {
    console.log("❌ Error creating owners table:", err);
  }
}

// helper function to create turfs table
async function createTurfsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS turfs (
        turf_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude DECIMAL(10,8) NOT NULL,
        longitude DECIMAL(11,8) NOT NULL,
        price_per_hour DECIMAL(10,2) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        owner_id INT,

        FOREIGN KEY (owner_id) REFERENCES owners(owner_id) ON DELETE CASCADE
      )
    `;

    await db.query(query);

    console.log("✅ Turfs table ready");
  } catch (err) {
    console.log("❌ Error creating turfs table:", err);
  }
}

// helper function to create slots table
async function createSlotsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS slots (
        slot_id INT AUTO_INCREMENT PRIMARY KEY,
        turf_id INT NOT NULL,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        is_booked BOOLEAN DEFAULT FALSE,
        price DECIMAL(10,2),
        booked_by INT,

        FOREIGN KEY (turf_id) REFERENCES turfs(turf_id) ON DELETE CASCADE,
        FOREIGN KEY (booked_by) REFERENCES users(user_id) ON DELETE SET NULL
      )
    `;

    await db.query(query);

    console.log("✅ Slots table ready");
  } catch (err) {
    console.log("❌ Error creating slots table:", err);
  }
}

// helper function to create bookings table
async function createBookingsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS bookings (
        booking_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        turf_id INT NOT NULL,
        slot_id INT NOT NULL,

        status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
        total_price DECIMAL(10,2),
        payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (turf_id) REFERENCES turfs(turf_id) ON DELETE CASCADE,
        FOREIGN KEY (slot_id) REFERENCES slots(slot_id) ON DELETE CASCADE
      )
    `;

    await db.query(query);

    console.log("✅ Bookings table ready");
  } catch (err) {
    console.log("❌ Error creating bookings table:", err);
  }
}

// helper function to create notification_logs table
async function createNotificationLogsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS notification_logs (
        notification_id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT,
        user_id INT,
        owner_id INT,

        channel ENUM('sms', 'whatsapp') NOT NULL,
        recipient_type ENUM('user', 'owner') NOT NULL,

        message TEXT,
        status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
        FOREIGN KEY (owner_id) REFERENCES owners(owner_id) ON DELETE SET NULL
      )
    `;

    await db.query(query);

    console.log("✅ Notification logs table ready");
  } catch (err) {
    console.log("❌ Error creating notification_logs table:", err);
  }
}

// helper function to create otp_verifications table
async function createOtpTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS otp_verifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mobile VARCHAR(15) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at DATETIME NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await db.query(query);

    console.log("✅ OTP table ready");
  } catch (err) {
    console.log("❌ Error creating OTP table:", err);
  }
}
export { connectDB, getDB };