-- CIZO Database Schema
-- Migration 001: Initial schema

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- SALONS
-- ============================================
CREATE TABLE salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  brand_color TEXT DEFAULT '#1A1A1A',
  opening_hours JSONB,
  settings JSONB DEFAULT '{}',
  stripe_customer_id TEXT,
  subscription_plan TEXT DEFAULT 'starter',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- STAFF
-- ============================================
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  auth_user_id UUID UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'barber',
  is_active BOOLEAN DEFAULT true,
  specialties TEXT[],
  avg_service_times JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_staff_salon ON staff(salon_id);
CREATE INDEX idx_staff_auth ON staff(auth_user_id);

-- ============================================
-- SERVICES
-- ============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  duration_minutes INT NOT NULL,
  price_cents INT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_services_salon ON services(salon_id);

-- ============================================
-- CLIENTS
-- ============================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  is_vip BOOLEAN DEFAULT false,
  hair_texture TEXT,
  preferred_style TEXT,
  has_beard BOOLEAN,
  notes TEXT,
  whatsapp_opt_in_marketing BOOLEAN DEFAULT false,
  whatsapp_opt_in_utility BOOLEAN DEFAULT true,
  opt_in_timestamp TIMESTAMPTZ,
  no_show_count INT DEFAULT 0,
  total_spent_cents INT DEFAULT 0,
  visit_count INT DEFAULT 0,
  last_visit_at TIMESTAMPTZ,
  avg_visit_frequency_days INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(salon_id, phone)
);

CREATE INDEX idx_clients_salon ON clients(salon_id);
CREATE INDEX idx_clients_phone ON clients(salon_id, phone);

-- ============================================
-- APPOINTMENTS
-- ============================================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,

  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  estimated_start TIMESTAMPTZ,

  status TEXT DEFAULT 'confirmed',
  delay_minutes INT DEFAULT 0,

  price_cents INT,
  notes TEXT,
  source TEXT DEFAULT 'booking',
  reminder_sent BOOLEAN DEFAULT false,
  delay_notified BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_appointments_salon_date ON appointments(salon_id, scheduled_start);
CREATE INDEX idx_appointments_staff_date ON appointments(staff_id, scheduled_start);
CREATE INDEX idx_appointments_client ON appointments(client_id);

-- ============================================
-- WAITLIST
-- ============================================
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  staff_id UUID REFERENCES staff(id),
  added_at TIMESTAMPTZ DEFAULT now(),
  contacted_at TIMESTAMPTZ,
  status TEXT DEFAULT 'waiting'
);

CREATE INDEX idx_waitlist_salon ON waitlist(salon_id);

-- ============================================
-- CAMPAIGNS
-- ============================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message_template TEXT NOT NULL,
  discount_percent INT,
  recipient_count INT,
  sent_at TIMESTAMPTZ,
  auto_relance_days INT DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_campaigns_salon ON campaigns(salon_id);

-- ============================================
-- CAMPAIGN RECIPIENTS
-- ============================================
CREATE TABLE campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  message_sent BOOLEAN DEFAULT false,
  message_delivered BOOLEAN DEFAULT false,
  message_read BOOLEAN DEFAULT false,
  whatsapp_message_id TEXT
);

CREATE INDEX idx_campaign_recipients_campaign ON campaign_recipients(campaign_id);

-- ============================================
-- MESSAGE LOG
-- ============================================
CREATE TABLE message_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  appointment_id UUID REFERENCES appointments(id),
  campaign_id UUID REFERENCES campaigns(id),
  channel TEXT DEFAULT 'whatsapp',
  category TEXT NOT NULL,
  template_name TEXT,
  message_body TEXT,
  status TEXT DEFAULT 'sent',
  whatsapp_message_id TEXT,
  cost_cents INT,
  sent_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_message_log_salon ON message_log(salon_id);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_cents INT NOT NULL,
  stock_quantity INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 5,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_products_salon ON products(salon_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Helper function to get the salon_id of the current user
CREATE OR REPLACE FUNCTION auth.get_salon_id()
RETURNS UUID AS $$
  SELECT salon_id FROM staff WHERE auth_user_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Enable RLS on all tables
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Salon policies
CREATE POLICY "salon_access" ON salons
  FOR ALL USING (id = auth.get_salon_id());

-- Staff policies
CREATE POLICY "salon_isolation" ON staff
  FOR ALL USING (salon_id = auth.get_salon_id());

-- Services policies
CREATE POLICY "salon_isolation" ON services
  FOR ALL USING (salon_id = auth.get_salon_id());

-- Clients policies
CREATE POLICY "salon_isolation" ON clients
  FOR ALL USING (salon_id = auth.get_salon_id());

-- Appointments policies
CREATE POLICY "salon_isolation" ON appointments
  FOR ALL USING (salon_id = auth.get_salon_id());

-- Waitlist policies
CREATE POLICY "salon_isolation" ON waitlist
  FOR ALL USING (salon_id = auth.get_salon_id());

-- Campaigns policies
CREATE POLICY "salon_isolation" ON campaigns
  FOR ALL USING (salon_id = auth.get_salon_id());

-- Campaign recipients: access through campaign
CREATE POLICY "salon_isolation" ON campaign_recipients
  FOR ALL USING (
    campaign_id IN (SELECT id FROM campaigns WHERE salon_id = auth.get_salon_id())
  );

-- Message log policies
CREATE POLICY "salon_isolation" ON message_log
  FOR ALL USING (salon_id = auth.get_salon_id());

-- Products policies
CREATE POLICY "salon_isolation" ON products
  FOR ALL USING (salon_id = auth.get_salon_id());

-- ============================================
-- REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE waitlist;
ALTER PUBLICATION supabase_realtime ADD TABLE message_log;
