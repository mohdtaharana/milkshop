-- ============================================================
-- MILKSHOP ERP - SEED DATA
-- ============================================================

-- Default admin user (username: admin, password: admin)
INSERT OR IGNORE INTO users (username, password_hash, display_name, role) VALUES
  ('admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Administrator', 'Admin');
