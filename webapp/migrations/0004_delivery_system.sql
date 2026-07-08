CREATE TABLE IF NOT EXISTS delivery_customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  alt_phone TEXT,
  colony TEXT,
  street TEXT,
  sector TEXT,
  house_no TEXT,
  address_line TEXT,
  milk_quantity REAL DEFAULT 1,
  delivery_time TEXT DEFAULT 'Morning',
  monthly_rate REAL DEFAULT 0,
  bill_type TEXT DEFAULT 'per_litre',
  monthly_fee REAL DEFAULT 0,
  pending_balance REAL DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'Active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS delivery_records (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  date TEXT NOT NULL,
  delivered INTEGER DEFAULT 0,
  quantity REAL,
  notes TEXT,
  FOREIGN KEY (customer_id) REFERENCES delivery_customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS delivery_payments (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  amount REAL NOT NULL,
  month TEXT NOT NULL,
  payment_method TEXT DEFAULT 'Cash',
  payment_date TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (customer_id) REFERENCES delivery_customers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_delivery_records_customer ON delivery_records(customer_id);
CREATE INDEX IF NOT EXISTS idx_delivery_records_date ON delivery_records(date);
CREATE INDEX IF NOT EXISTS idx_delivery_payments_customer ON delivery_payments(customer_id);
