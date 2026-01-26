const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserModel = require('./src/models/userModel');
const DeviceModel = require('./src/models/deviceModel');
const AuditModel = require('./src/models/auditModel');
const IncentiveModel = require('./src/models/incentiveModel');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- Connected to MongoDB Atlas ---');

        // 1. Clear existing data (Careful!)
        console.log('Cleaning existing collection data...');
        await UserModel.deleteMany({});
        await DeviceModel.deleteMany({});
        await AuditModel.deleteMany({});
        await IncentiveModel.deleteMany({});

        // 2. Create Users
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        console.log('Creating role-based accounts...');

        const citizen = await UserModel.create({
            email: 'citizen@example.com',
            password: passwordHash,
            role: 'citizen',
            displayName: 'John Doe'
        });

        const recycler = await UserModel.create({
            email: 'recycler@example.com',
            password: passwordHash,
            role: 'recycler',
            displayName: 'EcoCycle Facility',
            organization: 'EP-LICENSE-999'
        });

        const collector = await UserModel.create({
            email: 'collector@example.com',
            password: passwordHash,
            role: 'collector',
            displayName: 'Alex Agent',
            organization: 'Toyota Proace (X-123)'
        });

        const admin = await UserModel.create({
            email: 'admin@example.com',
            password: passwordHash,
            role: 'admin',
            displayName: 'System Root'
        });

        // 3. Create Sample Devices for Citizen
        console.log('Registering sample devices for citizen...');

        const device1 = await DeviceModel.create({
            uid: 'DEV-8892-A1',
            ownerId: citizen._id,
            model: 'MacBook Pro 2019',
            description: 'Slight battery swelling, screen works fine.',
            status: 'ACTIVE'
        });

        const device2 = await DeviceModel.create({
            uid: 'DEV-4412-B2',
            ownerId: citizen._id,
            model: 'iPhone 12',
            description: 'Cracked screen, wont turn on.',
            status: 'RECYCLING_REQUESTED' // Already requested to show in Recycler Dashboard
        });

        const device3 = await DeviceModel.create({
            uid: 'DEV-1102-C3',
            ownerId: citizen._id,
            model: 'Samsung LED Monitor',
            description: 'Heavy flickering, needs disposal.',
            status: 'COLLECTOR_ASSIGNED'
        });

        // 4. Create initial Audit Logs
        console.log('Generating initial audit logs...');
        await AuditModel.create([
            {
                actorId: citizen._id,
                action: 'DEVICE_REGISTERED',
                details: { uid: device1.uid, model: device1.model }
            },
            {
                actorId: citizen._id,
                action: 'STATUS_CHANGE',
                details: { uid: device2.uid, oldStatus: 'ACTIVE', newStatus: 'RECYCLING_REQUESTED' }
            }
        ]);

        console.log('\n==========================================');
        console.log('SEEDING COMPLETE - USE THESE LOGINS:');
        console.log('Password for all: password123');
        console.log('------------------------------------------');
        console.log('Citizen:   citizen@example.com');
        console.log('Recycler:  recycler@example.com');
        console.log('Collector: collector@example.com');
        console.log('Admin:     admin@example.com');
        console.log('==========================================\n');

        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedData();
