-- Run this file in your PostgreSQL database to create the taxes table if it does not exist.

CREATE TABLE IF NOT EXISTS taxes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rate NUMERIC(8,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL REFERENCES invoices(id),
  amount NUMERIC(12,2) NOT NULL,
  method VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
