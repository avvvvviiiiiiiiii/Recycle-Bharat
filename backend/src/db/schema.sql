-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to ensure clean state
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS incentives CASCADE;
DROP TABLE IF EXISTS lifecycle_events CASCADE;
DROP TABLE IF EXISTS collector_assignments CASCADE;
DROP TABLE IF EXISTS recycling_requests CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS admin_audit_logs CASCADE;

-- 1. ENUM Types (Strict State Control)
DO $$ BEGIN
    CREATE TYPE role_type AS ENUM ('CITIZEN', 'COLLECTOR', 'RECYCLER', 'GOVT', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE origin_type AS ENUM ('MANUFACTURER', 'SYSTEM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE device_state AS ENUM (
        'ACTIVE',
        'RECYCLING_REQUESTED',
        'COLLECTOR_ASSIGNED',
        'COLLECTED',
        'DELIVERED_TO_RECYCLER',
        'RECYCLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('PENDING', 'ASSIGNED', 'COLLECTED', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role role_type NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Password Reset Tokens Table
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Devices Table
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    device_uid UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    device_uid_origin origin_type NOT NULL DEFAULT 'SYSTEM',
    owner_id INTEGER REFERENCES users(id),
    device_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    purchase_year INTEGER,
    current_state device_state NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Recycling Requests Table
CREATE TABLE recycling_requests (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id) UNIQUE NOT NULL,
    citizen_id INTEGER REFERENCES users(id) NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_latitude DECIMAL(10, 8),
    pickup_longitude DECIMAL(11, 8),
    preferred_date DATE,
    status request_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Collector Assignments Table
CREATE TABLE collector_assignments (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES recycling_requests(id) UNIQUE NOT NULL,
    collector_id INTEGER REFERENCES users(id) NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    scheduled_pickup_time TIMESTAMP WITH TIME ZONE,
    actual_pickup_time TIMESTAMP WITH TIME ZONE,
    status request_status DEFAULT 'ASSIGNED',
    notes TEXT
);

-- 7. Lifecycle Events Table (Immutable Audit Log)
CREATE TABLE lifecycle_events (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id) NOT NULL,
    from_state VARCHAR(50),
    to_state VARCHAR(50) NOT NULL,
    triggered_by_user_id INTEGER REFERENCES users(id),
    event_type VARCHAR(100) NOT NULL,
    metadata JSONB,
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prevent updates to audit log
CREATE OR REPLACE FUNCTION prevent_updates()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Updates are not allowed on the lifecycle_events table. It is an immutable audit log.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_updates ON lifecycle_events;
CREATE TRIGGER trg_prevent_updates
BEFORE UPDATE ON lifecycle_events
FOR EACH ROW
EXECUTE FUNCTION prevent_updates();

-- 8. Incentives Table
CREATE TABLE incentives (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    device_id INTEGER REFERENCES devices(id),
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    points INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, PAID
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_devices_uid ON devices(device_uid);
CREATE INDEX IF NOT EXISTS idx_devices_owner ON devices(owner_id);
CREATE INDEX IF NOT EXISTS idx_devices_state ON devices(current_state);
CREATE INDEX IF NOT EXISTS idx_requests_status ON recycling_requests(status);
CREATE INDEX IF NOT EXISTS idx_assignments_collector ON collector_assignments(collector_id);
CREATE INDEX IF NOT EXISTS idx_lifecycle_device ON lifecycle_events(device_id);
