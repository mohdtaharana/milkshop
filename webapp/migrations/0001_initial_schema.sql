-- ============================================================
-- MILKSHOP ERP - FULL DATABASE SCHEMA
-- ============================================================

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  father_name TEXT DEFAULT 'N/A',
  phone TEXT NOT NULL,
  alt_phone TEXT,
  address TEXT NOT NULL,
  area TEXT NOT NULL,
  city TEXT DEFAULT 'Lahore',
  cnic TEXT DEFAULT 'N/A',
  type TEXT NOT NULL DEFAULT 'Residential',
  daily_qty_morning REAL DEFAULT 0,
  daily_qty_evening REAL DEFAULT 0,
  rate REAL DEFAULT 190,
  monthly_bill_estimate REAL DEFAULT 0,
  remaining_balance REAL DEFAULT 0,
  advance_payment REAL DEFAULT 0,
  credit_limit REAL DEFAULT 20000,
  last_payment_date TEXT,
  delivery_address TEXT,
  delivery_route_id TEXT DEFAULT 'ROUTE-01',
  status TEXT DEFAULT 'Active',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  village TEXT NOT NULL,
  milk_source TEXT DEFAULT 'Buffalo Milk',
  morning_supply REAL DEFAULT 0,
  evening_supply REAL DEFAULT 0,
  milk_fat REAL DEFAULT 6.0,
  snf REAL DEFAULT 8.5,
  rate REAL DEFAULT 155,
  purchase_qty_limit REAL,
  outstanding_balance REAL DEFAULT 0,
  bank_name TEXT,
  account_title TEXT,
  iban TEXT,
  status TEXT DEFAULT 'Active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Milk Collection Records
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  supplier_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  date TEXT NOT NULL,
  shift TEXT NOT NULL DEFAULT 'Morning',
  milk_type TEXT NOT NULL DEFAULT 'Buffalo Milk',
  quantity REAL NOT NULL DEFAULT 0,
  fat REAL DEFAULT 0,
  snf REAL DEFAULT 0,
  rate REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  remarks TEXT,
  temperature REAL DEFAULT 4.5,
  vehicle_no TEXT,
  receiver_name TEXT DEFAULT 'Quality Inspector',
  payment_status TEXT DEFAULT 'Pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- 4. Inventory Items
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'Milk',
  name TEXT NOT NULL,
  current_stock REAL DEFAULT 0,
  unit TEXT DEFAULT 'Litre',
  min_stock REAL DEFAULT 20,
  expiry_date TEXT,
  batch_number TEXT,
  stock_in REAL DEFAULT 0,
  stock_out REAL DEFAULT 0,
  damaged_stock REAL DEFAULT 0,
  returned_stock REAL DEFAULT 0,
  price_per_unit REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  date TEXT NOT NULL,
  milk_quantity REAL DEFAULT 0,
  rate REAL DEFAULT 0,
  discount REAL DEFAULT 0,
  tax REAL DEFAULT 0,
  extra_charges REAL DEFAULT 0,
  total REAL DEFAULT 0,
  paid REAL DEFAULT 0,
  remaining REAL DEFAULT 0,
  payment_method TEXT DEFAULT 'Cash',
  status TEXT DEFAULT 'Unpaid',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 5b. Invoice Line Items (Products in Invoice)
CREATE TABLE IF NOT EXISTS invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id TEXT NOT NULL,
  product_id TEXT,
  name TEXT NOT NULL,
  quantity REAL DEFAULT 1,
  unit TEXT DEFAULT 'Litre',
  rate REAL DEFAULT 0,
  amount REAL DEFAULT 0,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- 6. Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  amount REAL NOT NULL DEFAULT 0,
  date TEXT NOT NULL,
  paid_to TEXT,
  payment_method TEXT DEFAULT 'Cash',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Employees / Staff
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Helper',
  salary REAL DEFAULT 20000,
  attendance_today TEXT DEFAULT 'Not Marked',
  leaves_taken INTEGER DEFAULT 0,
  performance_score REAL DEFAULT 4.0,
  permissions TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Delivery Routes
CREATE TABLE IF NOT EXISTS delivery_routes (
  id TEXT PRIMARY KEY,
  route_name TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  delivery_boy_name TEXT,
  vehicle_no TEXT,
  total_deliveries INTEGER DEFAULT 0,
  completed_deliveries INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. Payment Records / Ledger
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  party_id TEXT NOT NULL,
  party_name TEXT NOT NULL,
  amount REAL NOT NULL DEFAULT 0,
  date TEXT NOT NULL,
  payment_method TEXT DEFAULT 'Cash',
  reference_no TEXT,
  remaining_balance REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'User',
  action TEXT NOT NULL,
  ip_address TEXT DEFAULT '127.0.0.1',
  browser TEXT DEFAULT 'Unknown',
  timestamp TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read INTEGER DEFAULT 0,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. Settings/Configuration Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 13. Users Table (Authentication)
CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_area ON customers(area);
CREATE INDEX IF NOT EXISTS idx_collections_date ON collections(date);
CREATE INDEX IF NOT EXISTS idx_collections_supplier ON collections(supplier_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(date);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_payments_party ON payments(party_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
