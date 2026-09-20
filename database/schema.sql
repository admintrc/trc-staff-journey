-- TRC Staff Journey Database Schema
-- PostgreSQL 12+

-- Users & Authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('staff', 'manager', 'director')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Staff Information
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  position VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  manager_id UUID REFERENCES staff(id),
  hire_date DATE NOT NULL,
  probation_end_date DATE,
  employment_type VARCHAR(50) CHECK (employment_type IN ('full-time', 'part-time', 'casual', 'contract')),
  employment_status VARCHAR(50) DEFAULT 'active' CHECK (employment_status IN ('active', 'on-leave', 'probation', 'left')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_hire_date ON staff(hire_date);
CREATE INDEX idx_staff_employment_status ON staff(employment_status);

-- Performance Reviews
CREATE TABLE IF NOT EXISTS performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES staff(id),
  review_type VARCHAR(50) CHECK (review_type IN ('probation', 'six-month', 'annual', 'ad-hoc')),
  review_date DATE NOT NULL,
  overall_rating INT CHECK (overall_rating BETWEEN 1 AND 5),
  feedback TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'archived')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_staff_id ON performance_reviews(staff_id);
CREATE INDEX idx_reviews_review_date ON performance_reviews(review_date);

-- Training & Compliance
CREATE TABLE IF NOT EXISTS training_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  training_name VARCHAR(200) NOT NULL,
  training_date DATE NOT NULL,
  expiry_date DATE,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'expired', 'overdue')),
  certificate_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_training_staff_id ON training_records(staff_id);
CREATE INDEX idx_training_expiry_date ON training_records(expiry_date);

-- Forms & Checklists
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type VARCHAR(50) NOT NULL CHECK (form_type IN ('workforce-request', 'interview-scoring', 'reference-check', 'pre-employment', 'onboarding', 'probation-review', 'supervision', 'performance-review', 'smart-goal', 'career-plan', 'training-matrix', 'performance-concern', 'pip', 'exit-checklist')),
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES staff(id),
  data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'submitted', 'approved', 'archived')),
  submitted_at TIMESTAMP,
  approved_by UUID REFERENCES staff(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_forms_staff_id ON forms(staff_id);
CREATE INDEX idx_forms_type ON forms(form_type);
CREATE INDEX idx_forms_status ON forms(status);

-- Supervision & One-to-Ones
CREATE TABLE IF NOT EXISTS supervision_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  supervisor_id UUID NOT NULL REFERENCES staff(id),
  supervision_date DATE NOT NULL,
  notes TEXT,
  topics VARCHAR(500)[],
  action_items TEXT,
  next_session_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supervision_staff_id ON supervision_records(staff_id);
CREATE INDEX idx_supervision_date ON supervision_records(supervision_date);

-- Goals & Development Plans
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  goal_title VARCHAR(255) NOT NULL,
  goal_description TEXT,
  smart_criteria JSONB,
  target_date DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold', 'archived')),
  progress_percentage INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_goals_staff_id ON goals(staff_id);

-- Reminders & Tasks
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id),
  reminder_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  reminder_date DATE NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reminders_staff_id ON reminders(staff_id);
CREATE INDEX idx_reminders_date ON reminders(reminder_date);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  performed_by UUID NOT NULL REFERENCES staff(id),
  changes JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);

-- Org Chart Metadata
CREATE TABLE IF NOT EXISTS organizational_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  manager_id UUID REFERENCES staff(id),
  parent_unit_id UUID REFERENCES organizational_units(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_org_parent ON organizational_units(parent_unit_id);
