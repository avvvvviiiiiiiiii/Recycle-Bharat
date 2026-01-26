-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('CITIZEN', 'COLLECTOR', 'RECYCLER', 'ADMIN')),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Devices Table
CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  device_uid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
  device_uid_origin VARCHAR(50) NOT NULL CHECK (device_uid_origin IN ('MANUFACTURER', 'SYSTEM')),
  owner_id INTEGER REFERENCES users(id),
  device_type VARCHAR(100) NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(100),
  purchase_year INTEGER,
  current_state VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (current_state IN (
    'ACTIVE',
    'RECYCLING_REQUESTED',
    'COLLECTOR_ASSIGNED',
    'COLLECTED',
    'DELIVERED_TO_RECYCLER',
    'RECYCLED'
  )),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Recycling Requests Table
CREATE TABLE IF NOT EXISTS recycling_requests (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(id) UNIQUE,
  citizen_id INTEGER REFERENCES users(id),
  pickup_address TEXT NOT NULL,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  preferred_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN (
    'PENDING',
    'ASSIGNED',
    'COLLECTED',
    'COMPLETED',
    'CANCELLED'
  )),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Collector Assignments Table
CREATE TABLE IF NOT EXISTS collector_assignments (
  id SERIAL PRIMARY KEY,
  request_id INTEGER REFERENCES recycling_requests(id) UNIQUE,
  collector_id INTEGER REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  scheduled_pickup_time TIMESTAMP,
  actual_pickup_time TIMESTAMP,
  verification_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'ASSIGNED' CHECK (status IN ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'FAILED')),
  notes TEXT
);

-- 5. Lifecycle Events Table (Immutable Audit Log)
CREATE TABLE IF NOT EXISTS lifecycle_events (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(id) NOT NULL,
  from_state VARCHAR(50) NOT NULL,
  to_state VARCHAR(50) NOT NULL,
  triggered_by_user_id INTEGER REFERENCES users(id),
  event_type VARCHAR(100) NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- 6. Incentives Table
CREATE TABLE IF NOT EXISTS incentives (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  device_id INTEGER REFERENCES devices(id),
  amount DECIMAL(10, 2) NOT NULL,
  points INTEGER,
  issued_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'DISBURSED', 'REJECTED')),
  approved_by INTEGER REFERENCES users(id),
  disbursed_at TIMESTAMP,
  transaction_id VARCHAR(100),
  notes TEXT
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'INFO',
  related_entity_type VARCHAR(50),
  related_entity_id INTEGER,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  target_entity_type VARCHAR(50),
  target_entity_id INTEGER,
  changes JSONB,
  ip_address INET,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_devices_uid ON devices(device_uid);
CREATE INDEX IF NOT EXISTS idx_devices_owner ON devices(owner_id);
CREATE INDEX IF NOT EXISTS idx_devices_state ON devices(current_state);
CREATE INDEX IF NOT EXISTS idx_requests_citizen ON recycling_requests(citizen_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON recycling_requests(status);
CREATE INDEX IF NOT EXISTS idx_assignments_collector ON collector_assignments(collector_id);
CREATE INDEX IF NOT EXISTS idx_lifecycle_device ON lifecycle_events(device_id);
