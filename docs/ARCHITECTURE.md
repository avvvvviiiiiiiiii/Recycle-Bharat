# BharatRecycle - Backend Architecture Documentation

## System Overview

BharatRecycle is a government-aligned digital product passport system for e-waste lifecycle tracking in India. It provides end-to-end traceability of electronic devices from active use through recycling, with full auditability and incentive management.

## Technology Stack

- **Database**: PostgreSQL (hosted on Render)
- **Backend**: Node.js + Express.js
- **Authentication**: JWT-based with role-based access control (RBAC)
- **State Management**: Finite State Machine for device lifecycle
- **API Style**: RESTful APIs

## Architecture Principles

1. **Single Shared Backend**: One unified API gateway serving all user roles
2. **Role-Based Access Control (RBAC)**: Application-layer authorization
3. **Immutable Audit Trail**: All state transitions recorded permanently
4. **State Machine Enforcement**: Strict lifecycle progression validation
5. **Security-First**: Device UIDs never exposed to clients
6. **Centralized Database**: Only backend connects to PostgreSQL

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Citizens   │  Collectors  │  Recyclers   │    Admins      │
│   (Web/App)  │  (Web/App)   │  (Web/App)   │   (Web/App)    │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       └──────────────┴──────────────┴────────────────┘
                           │
                           ▼
       ┌────────────────────────────────────────────┐
       │         API Gateway (Express.js)           │
       │  - CORS, Rate Limiting, Request Validation │
       └────────────────────┬───────────────────────┘
                           │
       ┌────────────────────┴───────────────────────┐
       │       Authentication Middleware             │
       │    - JWT Verification                       │
       │    - Role Extraction                        │
       └────────────────────┬───────────────────────┘
                           │
       ┌────────────────────┴───────────────────────┐
       │      Authorization Middleware               │
       │    - RBAC Policy Enforcement                │
       │    - Resource-level Permissions             │
       └────────────────────┬───────────────────────┘
                           │
       ┌────────────────────┴───────────────────────┐
       │           Route Controllers                 │
       ├────────────┬────────────┬───────────────────┤
       │   Auth     │  Devices   │  Recycling        │
       │ Controller │ Controller │  Controller       │
       └────┬───────┴─────┬──────┴────────┬──────────┘
            │             │               │
       ┌────┴─────────────┴───────────────┴──────────┐
       │            Service Layer                     │
       ├──────────────┬───────────────┬───────────────┤
       │ AuthService  │ DeviceService │ LifecycleService│
       │              │               │ IncentiveService│
       └──────┬───────┴───────┬───────┴────────┬──────┘
              │               │                │
       ┌──────┴───────────────┴────────────────┴──────┐
       │         State Machine Validator               │
       │  - Lifecycle Transition Rules                 │
       │  - Business Logic Enforcement                 │
       └──────────────────────┬────────────────────────┘
                              │
       ┌──────────────────────┴────────────────────────┐
       │         Data Access Layer (DAL)               │
       │  - Query Builders                             │
       │  - Transaction Management                     │
       │  - Connection Pooling                         │
       └──────────────────────┬────────────────────────┘
                              │
       ┌──────────────────────┴────────────────────────┐
       │         PostgreSQL Database                   │
       │  - ACID Transactions                          │
       │  - Row-Level Security Ready                   │
       │  - Audit Logging                              │
       └───────────────────────────────────────────────┘
```

## Database Schema Design

### Core Entities

#### 1. Users Table
```sql
users (
  id: SERIAL PRIMARY KEY,
  email: VARCHAR UNIQUE NOT NULL,
  password_hash: VARCHAR NOT NULL,
  role: ENUM('CITIZEN', 'COLLECTOR', 'RECYCLER', 'ADMIN') NOT NULL,
  full_name: VARCHAR NOT NULL,
  phone: VARCHAR,
  address: TEXT,
  is_active: BOOLEAN DEFAULT true,
  created_at: TIMESTAMP DEFAULT NOW(),
  updated_at: TIMESTAMP DEFAULT NOW()
)
```

#### 2. Devices Table
```sql
devices (
  id: SERIAL PRIMARY KEY,
  device_uid: UUID UNIQUE NOT NULL,  -- Non-public identifier
  device_uid_origin: ENUM('MANUFACTURER', 'SYSTEM') NOT NULL,
  owner_id: INTEGER REFERENCES users(id),
  device_type: VARCHAR NOT NULL,
  brand: VARCHAR,
  model: VARCHAR,
  purchase_year: INTEGER,
  current_state: ENUM(
    'ACTIVE',
    'RECYCLING_REQUESTED',
    'COLLECTOR_ASSIGNED',
    'COLLECTED',
    'DELIVERED_TO_RECYCLER',
    'RECYCLED'
  ) NOT NULL DEFAULT 'ACTIVE',
  created_at: TIMESTAMP DEFAULT NOW(),
  updated_at: TIMESTAMP DEFAULT NOW()
)
```

#### 3. Recycling Requests Table
```sql
recycling_requests (
  id: SERIAL PRIMARY KEY,
  device_id: INTEGER REFERENCES devices(id) UNIQUE,
  citizen_id: INTEGER REFERENCES users(id),
  pickup_address: TEXT NOT NULL,
  pickup_latitude: DECIMAL(10, 8),
  pickup_longitude: DECIMAL(11, 8),
  preferred_date: DATE,
  status: ENUM(
    'PENDING',
    'ASSIGNED',
    'COLLECTED',
    'COMPLETED',
    'CANCELLED'
  ) NOT NULL DEFAULT 'PENDING',
  created_at: TIMESTAMP DEFAULT NOW(),
  updated_at: TIMESTAMP DEFAULT NOW()
)
```

#### 4. Collector Assignments Table
```sql
collector_assignments (
  id: SERIAL PRIMARY KEY,
  request_id: INTEGER REFERENCES recycling_requests(id) UNIQUE,
  collector_id: INTEGER REFERENCES users(id),
  assigned_at: TIMESTAMP DEFAULT NOW(),
  scheduled_pickup_time: TIMESTAMP,
  actual_pickup_time: TIMESTAMP,
  verification_method: VARCHAR,  -- e.g., 'UID_SCAN', 'PHOTO'
  status: ENUM('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'FAILED') DEFAULT 'ASSIGNED',
  notes: TEXT
)
```

#### 5. Lifecycle Events Table (Immutable Audit Log)
```sql
lifecycle_events (
  id: SERIAL PRIMARY KEY,
  device_id: INTEGER REFERENCES devices(id) NOT NULL,
  from_state: VARCHAR NOT NULL,
  to_state: VARCHAR NOT NULL,
  triggered_by_user_id: INTEGER REFERENCES users(id),
  event_type: VARCHAR NOT NULL,  -- e.g., 'STATE_TRANSITION', 'UID_VERIFICATION'
  metadata: JSONB,  -- Additional context (location, photos, etc.)
  timestamp: TIMESTAMP DEFAULT NOW(),
  ip_address: INET,
  user_agent: TEXT,
  
  CONSTRAINT no_updates CHECK (false)  -- Prevents UPDATEs
)
```

#### 6. Incentives Table
```sql
incentives (
  id: SERIAL PRIMARY KEY,
  user_id: INTEGER REFERENCES users(id),
  device_id: INTEGER REFERENCES devices(id),
  amount: DECIMAL(10, 2) NOT NULL,
  points: INTEGER,
  issued_at: TIMESTAMP DEFAULT NOW(),
  status: ENUM('PENDING', 'APPROVED', 'DISBURSED', 'REJECTED') DEFAULT 'PENDING',
  approved_by: INTEGER REFERENCES users(id),
  disbursed_at: TIMESTAMP,
  transaction_id: VARCHAR,
  notes: TEXT
)
```

#### 7. Notifications Table
```sql
notifications (
  id: SERIAL PRIMARY KEY,
  user_id: INTEGER REFERENCES users(id),
  title: VARCHAR NOT NULL,
  message: TEXT NOT NULL,
  type: ENUM('INFO', 'SUCCESS', 'WARNING', 'ALERT') DEFAULT 'INFO',
  related_entity_type: VARCHAR,  -- 'DEVICE', 'REQUEST', 'INCENTIVE'
  related_entity_id: INTEGER,
  is_read: BOOLEAN DEFAULT false,
  created_at: TIMESTAMP DEFAULT NOW()
)
```

#### 8. Admin Audit Logs Table
```sql
admin_audit_logs (
  id: SERIAL PRIMARY KEY,
  admin_id: INTEGER REFERENCES users(id),
  action: VARCHAR NOT NULL,  -- e.g., 'USER_DEACTIVATION', 'INCENTIVE_APPROVAL'
  target_entity_type: VARCHAR,
  target_entity_id: INTEGER,
  changes: JSONB,  -- Before/after state
  ip_address: INET,
  timestamp: TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT no_updates CHECK (false)  -- Prevents UPDATEs
)
```

### Indexes for Performance

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Device queries
CREATE INDEX idx_devices_uid ON devices(device_uid);
CREATE INDEX idx_devices_owner ON devices(owner_id);
CREATE INDEX idx_devices_state ON devices(current_state);

-- Request queries
CREATE INDEX idx_requests_citizen ON recycling_requests(citizen_id);
CREATE INDEX idx_requests_status ON recycling_requests(status);
CREATE INDEX idx_requests_device ON recycling_requests(device_id);

-- Assignment queries
CREATE INDEX idx_assignments_collector ON collector_assignments(collector_id);
CREATE INDEX idx_assignments_request ON collector_assignments(request_id);

-- Lifecycle audit trail
CREATE INDEX idx_lifecycle_device ON lifecycle_events(device_id);
CREATE INDEX idx_lifecycle_timestamp ON lifecycle_events(timestamp DESC);

-- Incentive queries
CREATE INDEX idx_incentives_user ON incentives(user_id);
CREATE INDEX idx_incentives_status ON incentives(status);
```

## State Machine: Device Lifecycle

### Valid State Transitions

```
ACTIVE 
  → RECYCLING_REQUESTED (when citizen creates request)

RECYCLING_REQUESTED 
  → COLLECTOR_ASSIGNED (when admin/system assigns collector)
  → ACTIVE (if request cancelled)

COLLECTOR_ASSIGNED 
  → COLLECTED (after UID verification at pickup)
  → RECYCLING_REQUESTED (if assignment fails)

COLLECTED 
  → DELIVERED_TO_RECYCLER (when collector delivers)

DELIVERED_TO_RECYCLER 
  → RECYCLED (after recycler confirms processing)

RECYCLED 
  → [TERMINAL STATE] (no further transitions)
```

### Transition Guards

Each transition requires:
1. **Authentication**: Valid JWT token
2. **Authorization**: Correct role for action
3. **State Validation**: Current state matches expected from_state
4. **Business Rules**: 
   - UID verification for COLLECTED transition
   - Recycler confirmation for RECYCLED transition
   - Geographic proximity for pickup (optional)

## API Design Patterns

### 1. Device Registration Flow

**Endpoint**: `POST /api/devices/register`

**Request**:
```json
{
  "deviceType": "smartphone",
  "brand": "Samsung",
  "model": "Galaxy S20",
  "purchaseYear": 2020,
  "manufacturerUID": "optional-uuid-from-manufacturer"
}
```

**Flow**:
1. Authenticate user (must be CITIZEN)
2. Generate device_uid (SYSTEM) or validate manufacturer UID
3. Create device record with state = ACTIVE
4. Create lifecycle event (NULL → ACTIVE)
5. Return sanitized device info (NO UID exposed)

**Response**:
```json
{
  "success": true,
  "device": {
    "id": 123,
    "deviceType": "smartphone",
    "brand": "Samsung",
    "model": "Galaxy S20",
    "currentState": "ACTIVE",
    "registeredAt": "2026-01-26T14:30:00Z"
  }
}
```

### 2. Recycling Request Creation

**Endpoint**: `POST /api/recycling/request`

**Request**:
```json
{
  "deviceId": 123,
  "pickupAddress": "123 MG Road, Bangalore",
  "coordinates": { "lat": 12.9716, "lng": 77.5946 },
  "preferredDate": "2026-02-01"
}
```

**Flow**:
1. Authenticate user (CITIZEN)
2. Validate device ownership
3. Check device state = ACTIVE
4. Create recycling_request
5. Transition device: ACTIVE → RECYCLING_REQUESTED
6. Create lifecycle event
7. Notify nearby collectors

**Error Handling**:
- `403`: Not device owner
- `409`: Device already in recycling flow
- `400`: Invalid state transition

### 3. Collector Assignment

**Endpoint**: `POST /api/admin/assign-collector`

**Request**:
```json
{
  "requestId": 456,
  "collectorId": 789,
  "scheduledTime": "2026-02-01T10:00:00Z"
}
```

**Flow**:
1. Authenticate admin/system
2. Validate request exists and status = PENDING
3. Validate collector role
4. Create collector_assignment
5. Update request status = ASSIGNED
6. Transition device: RECYCLING_REQUESTED → COLLECTOR_ASSIGNED
7. Create lifecycle event
8. Notify collector and citizen

### 4. Pickup Verification (Critical Security)

**Endpoint**: `POST /api/collector/verify-pickup`

**Request**:
```json
{
  "assignmentId": 101,
  "deviceUID": "uuid-scanned-at-location",
  "location": { "lat": 12.9716, "lng": 77.5946 },
  "verificationPhoto": "base64-or-url"
}
```

**Flow**:
1. Authenticate collector
2. Validate assignment belongs to collector
3. **CRITICAL**: Fetch device_uid from DB and compare with provided UID
4. Validate geographic proximity (optional)
5. Transition device: COLLECTOR_ASSIGNED → COLLECTED
6. Update assignment status = COMPLETED
7. Record pickup_time
8. Create lifecycle event with verification metadata
9. Notify citizen

**Security**:
- UID NEVER sent to client beforehand
- Client submits scanned UID
- Server validates against DB
- Failed verification logged for fraud detection

### 5. Recycler Confirmation & Incentive Issuance

**Endpoint**: `POST /api/recycler/confirm-recycling`

**Request**:
```json
{
  "deviceId": 123,
  "recyclingMethod": "component-separation",
  "certificateNumber": "CERT-2026-001",
  "photos": ["url1", "url2"]
}
```

**Flow**:
1. Authenticate recycler
2. Validate device state = DELIVERED_TO_RECYCLER
3. Transition device: DELIVERED_TO_RECYCLER → RECYCLED
4. Create lifecycle event
5. **Calculate incentive** based on device type/condition
6. Create incentive record (status = PENDING)
7. Trigger admin approval workflow
8. Notify citizen of completion

**Incentive Approval** (separate endpoint):
```
POST /api/admin/approve-incentive
{
  "incentiveId": 999,
  "approved": true,
  "transactionId": "TXN-123"
}
```

## Failure Handling

### Invalid UID Scenario

**Trigger**: Collector scans wrong device

**Response**:
```json
{
  "error": "VERIFICATION_FAILED",
  "message": "Device UID mismatch",
  "code": 403
}
```

**System Behavior**:
1. Log failed attempt in lifecycle_events
2. Increment failed_attempts on assignment
3. After 3 failures, flag for admin review
4. Notify admin of potential fraud

### Wrong State Transition

**Trigger**: API call for invalid state change

**Response**:
```json
{
  "error": "INVALID_STATE_TRANSITION",
  "message": "Cannot transition from ACTIVE to COLLECTED",
  "currentState": "ACTIVE",
  "allowedTransitions": ["RECYCLING_REQUESTED"]
}
```

**System Behavior**:
1. Reject transaction immediately
2. Log attempt in audit logs
3. Return current state and valid next states

### Duplicate Request

**Trigger**: Citizen creates second request for same device

**Response**:
```json
{
  "error": "DUPLICATE_REQUEST",
  "message": "Device already has active recycling request",
  "existingRequestId": 456
}
```

**System Behavior**:
1. Check for existing non-completed requests
2. Return existing request details
3. Prevent state corruption

## Security Measures

1. **Device UID Protection**:
   - Never included in GET responses
   - Only transmitted during verification
   - One-way validation (client → server)

2. **JWT Authentication**:
   - Short expiry (15 min access, 7 day refresh)
   - Role embedded in claims
   - Signature verification on every request

3. **SQL Injection Prevention**:
   - Parameterized queries only
   - ORM/query builder with escaping
   - Input validation middleware

4. **Rate Limiting**:
   - 100 requests/15 min per user
   - 10 requests/min for auth endpoints

5. **Audit Trail**:
   - All state changes logged
   - Immutable lifecycle_events table
   - Admin actions tracked

## MVP Implementation Plan

### Phase 1: Foundation (Week 1)
- [x] PostgreSQL schema creation
- [x] Connection pooling setup
- [x] User authentication (JWT)
- [x] Basic CRUD for users, devices

### Phase 2: Core Workflows (Week 2)
- [ ] Device registration API
- [ ] Recycling request creation
- [ ] State machine validator
- [ ] Lifecycle event logging

### Phase 3: Collector Flow (Week 3)
- [ ] Collector assignment logic
- [ ] UID verification endpoint
- [ ] Geolocation validation
- [ ] Pickup confirmation

### Phase 4: Recycler & Incentives (Week 4)
- [ ] Recycler confirmation
- [ ] Incentive calculation
- [ ] Admin approval workflow
- [ ] Notification system

### Phase 5: Admin & Monitoring (Week 5)
- [ ] Admin dashboard APIs
- [ ] Audit log queries
- [ ] Analytics endpoints
- [ ] Health checks & monitoring

## Technical Debt & Trade-offs

### MVP Shortcuts
1. **No real-time notifications**: Using polling instead of WebSockets
2. **Manual collector assignment**: Auto-assignment algorithm deferred
3. **Simple incentive calculation**: Flat rate, no ML-based pricing
4. **Email notifications**: SMS integration postponed
5. **Basic geofencing**: Advanced location fraud detection later

### Future Enhancements
1. **Blockchain integration**: Immutable lifecycle records on distributed ledger
2. **ML-based fraud detection**: Pattern recognition for fake pickups
3. **Dynamic incentive pricing**: Market-based valuation
4. **Mobile SDK**: Native device UID extraction
5. **Real-time dashboard**: WebSocket-based live updates

## Deployment Architecture

```
Load Balancer (Nginx/Cloudflare)
    ↓
API Server Cluster (PM2/K8s)
    ↓
PostgreSQL Primary (Render)
    ↓
Read Replicas (future)
```

### Environment Variables
```
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=xxx
JWT_EXPIRE=15m
PORT=5000
NODE_ENV=production
```

## Monitoring & Observability

1. **Application Metrics**:
   - Request latency (p50, p95, p99)
   - Error rates by endpoint
   - Active sessions

2. **Business Metrics**:
   - Devices registered/day
   - Successful pickups ratio
   - Average lifecycle duration
   - Incentives disbursed

3. **Database Metrics**:
   - Connection pool usage
   - Query performance
   - Table sizes

## Conclusion

This architecture prioritizes **correctness**, **auditability**, and **security** for a government-aligned system. The state machine ensures data integrity, the audit trail provides full transparency, and the UID verification prevents fraud.

The MVP focuses on core workflows with clear extension points for future enhancements.
