const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // Load from backend root

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

const seed = async () => {
    try {
        console.log('🌱 Starting Database Seeding...');

        // Clear existing data (in reverse order of dependencies)
        await pool.query('TRUNCATE TABLE notifications, incentives, lifecycle_events, collector_assignments, recycling_requests, devices, users RESTART IDENTITY CASCADE');

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        // 1. Create Users (One for each role)
        const users = [
            ['admin@recycle.com', passwordHash, 'ADMIN', 'System Admin', '9999999999'],
            ['citizen@gmail.com', passwordHash, 'CITIZEN', 'Rahul Sharma', '9876543210'],
            ['kabadi@recycle.com', passwordHash, 'COLLECTOR', 'Ramesh Kabadi', '8888888888'],
            ['recycler@green.com', passwordHash, 'RECYCLER', 'Green Earth Recyclers', '7777777777'],
            ['govt@india.gov.in', passwordHash, 'GOVT', 'Pollution Control Board', '6666666666']
        ];

        for (const user of users) {
            await pool.query(
                `INSERT INTO users (email, password_hash, role, full_name, phone) VALUES ($1, $2, $3, $4, $5)`,
                user
            );
        }
        console.log('✅ Users seeded');

        // Get User IDs
        const citizenRes = await pool.query("SELECT id FROM users WHERE email = 'citizen@gmail.com'");
        const citizenId = citizenRes.rows[0].id;

        const collectorRes = await pool.query("SELECT id FROM users WHERE email = 'kabadi@recycle.com'");
        const collectorId = collectorRes.rows[0].id;

        // 2. Create Devices
        const devices = [
            [citizenId, 'Smartphone', 'Samsung', 'Galaxy S21', 2021, 'ACTIVE'],
            [citizenId, 'Laptop', 'Dell', 'XPS 13', 2019, 'RECYCLING_REQUESTED'],
            [citizenId, 'Tablet', 'Apple', 'iPad Air', 2020, 'COLLECTED']
        ];

        for (const device of devices) {
            await pool.query(
                `INSERT INTO devices (owner_id, device_type, brand, model, purchase_year, current_state) VALUES ($1, $2, $3, $4, $5, $6)`,
                device
            );
        }
        console.log('✅ Devices seeded');

        console.log('🌱 Seeding Completed Successfully!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Seeding Failed:', JSON.stringify(err, null, 2));
        process.exit(1);
    }
};

seed();
