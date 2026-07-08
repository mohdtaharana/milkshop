/// <reference types="@cloudflare/workers-types" />
import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('/api/*', cors());
app.use('/api/*', logger());

// ─── Utility ────────────────────────────────────────────────
function nanoid(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── CUSTOMERS ──────────────────────────────────────────────

// GET all customers
app.get('/api/customers', async (c) => {
  const { DB } = c.env;
  const { results } = await DB.prepare('SELECT * FROM customers ORDER BY name').all();
  return c.json({ success: true, data: results });
});

// GET single customer
app.get('/api/customers/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  const result = await DB.prepare('SELECT * FROM customers WHERE id = ?').bind(id).first();
  if (!result) return c.json({ success: false, error: 'Customer not found' }, 404);
  return c.json({ success: true, data: result });
});

// POST create customer
app.post('/api/customers', async (c) => {
  const { DB } = c.env;
  const body = await c.req.json();
  const id = `CUST-${nanoid()}`;
  const monthlyBill = (body.daily_qty_morning + body.daily_qty_evening) * body.rate * 30;

  await DB.prepare(`
    INSERT INTO customers (id, name, father_name, phone, alt_phone, address, area, city, cnic, type,
      daily_qty_morning, daily_qty_evening, rate, monthly_bill_estimate, remaining_balance,
      advance_payment, credit_limit, delivery_address, delivery_route_id, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, body.name, body.father_name || 'N/A', body.phone, body.alt_phone || null,
    body.address, body.area, body.city || 'Lahore', body.cnic || 'N/A', body.type || 'Residential',
    body.daily_qty_morning || 0, body.daily_qty_evening || 0, body.rate || 190,
    monthlyBill, body.advance_payment > 0 ? -body.advance_payment : 0,
    body.pending_balance || 0, body.credit_limit || 20000,
    body.delivery_address || body.address, body.delivery_route_id || 'ROUTE-01',
    'Active', body.notes || null
  ).run();

  // Log action
  await logAudit(DB, 'Admin', 'Admin', `Added new customer: ${body.name} (${id})`);
  const newCustomer = await DB.prepare('SELECT * FROM customers WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: newCustomer }, 201);
});

// PATCH update customer
app.patch('/api/customers/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  const body = await c.req.json();

  const existing = await DB.prepare('SELECT * FROM customers WHERE id = ?').bind(id).first() as any;
  if (!existing) return c.json({ success: false, error: 'Customer not found' }, 404);

  const merged = { ...existing, ...body };
  const monthlyBill = (merged.daily_qty_morning + merged.daily_qty_evening) * merged.rate * 30;

  await DB.prepare(`
    UPDATE customers SET name=?, father_name=?, phone=?, alt_phone=?, address=?, area=?, city=?,
      cnic=?, type=?, daily_qty_morning=?, daily_qty_evening=?, rate=?, monthly_bill_estimate=?,
      remaining_balance=?, advance_payment=?, credit_limit=?, delivery_address=?,
      delivery_route_id=?, status=?, notes=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).bind(
    merged.name, merged.father_name, merged.phone, merged.alt_phone || null,
    merged.address, merged.area, merged.city, merged.cnic, merged.type,
    merged.daily_qty_morning, merged.daily_qty_evening, merged.rate, monthlyBill,
    merged.remaining_balance, merged.advance_payment, merged.credit_limit,
    merged.delivery_address, merged.delivery_route_id, merged.status, merged.notes || null, id
  ).run();

  await logAudit(DB, 'Admin', 'Admin', `Updated customer: ${merged.name} (${id})`);
  const updated = await DB.prepare('SELECT * FROM customers WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: updated });
});

// DELETE customer
app.delete('/api/customers/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  const existing = await DB.prepare('SELECT name FROM customers WHERE id = ?').bind(id).first() as any;
  if (!existing) return c.json({ success: false, error: 'Not found' }, 404);

  await DB.prepare('DELETE FROM customers WHERE id = ?').bind(id).run();
  await logAudit(DB, 'Admin', 'Admin', `Deleted customer: ${existing.name} (${id})`);
  return c.json({ success: true, message: 'Deleted' });
});

// ─── SUPPLIERS ──────────────────────────────────────────────

app.get('/api/suppliers', async (c) => {
  const { DB } = c.env;
  const { results } = await DB.prepare('SELECT * FROM suppliers ORDER BY name').all();
  return c.json({ success: true, data: results });
});

app.get('/api/suppliers/:id', async (c) => {
  const { DB } = c.env;
  const result = await DB.prepare('SELECT * FROM suppliers WHERE id = ?').bind(c.req.param('id')).first();
  if (!result) return c.json({ success: false, error: 'Not found' }, 404);
  return c.json({ success: true, data: result });
});

app.post('/api/suppliers', async (c) => {
  const { DB } = c.env;
  const body = await c.req.json();
  const id = `SUPP-${nanoid()}`;

  await DB.prepare(`
    INSERT INTO suppliers (id, name, phone, address, village, milk_source, morning_supply,
      evening_supply, milk_fat, snf, rate, outstanding_balance, bank_name, account_title, iban, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, 'Active')
  `).bind(
    id, body.name, body.phone, body.address || '', body.village, body.milk_source || 'Buffalo Milk',
    body.morning_supply || 0, body.evening_supply || 0, body.milk_fat || 6.0,
    body.snf || 8.5, body.rate || 155,
    body.bank_name || null, body.account_title || null, body.iban || null
  ).run();

  await logAudit(DB, 'Admin', 'Admin', `Added new supplier: ${body.name} (${id})`);
  const newSupplier = await DB.prepare('SELECT * FROM suppliers WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: newSupplier }, 201);
});

app.patch('/api/suppliers/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  const body = await c.req.json();
  const existing = await DB.prepare('SELECT * FROM suppliers WHERE id = ?').bind(id).first() as any;
  if (!existing) return c.json({ success: false, error: 'Not found' }, 404);

  const merged = { ...existing, ...body };
  await DB.prepare(`
    UPDATE suppliers SET name=?, phone=?, address=?, village=?, milk_source=?, morning_supply=?,
      evening_supply=?, milk_fat=?, snf=?, rate=?, outstanding_balance=?, bank_name=?,
      account_title=?, iban=?, status=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).bind(
    merged.name, merged.phone, merged.address, merged.village, merged.milk_source,
    merged.morning_supply, merged.evening_supply, merged.milk_fat, merged.snf,
    merged.rate, merged.outstanding_balance, merged.bank_name || null,
    merged.account_title || null, merged.iban || null, merged.status, id
  ).run();

  await logAudit(DB, 'Admin', 'Admin', `Updated supplier: ${merged.name} (${id})`);
  const updated = await DB.prepare('SELECT * FROM suppliers WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: updated });
});

app.delete('/api/suppliers/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  const existing = await DB.prepare('SELECT name FROM suppliers WHERE id = ?').bind(id).first() as any;
  if (!existing) return c.json({ success: false, error: 'Not found' }, 404);
  await DB.prepare('DELETE FROM suppliers WHERE id = ?').bind(id).run();
  await logAudit(DB, 'Admin', 'Admin', `Deleted supplier: ${existing.name} (${id})`);
  return c.json({ success: true, message: 'Deleted' });
});

// ─── MILK COLLECTIONS ───────────────────────────────────────

app.get('/api/collections', async (c) => {
  const { DB } = c.env;
  const { results } = await DB.prepare(
    'SELECT * FROM collections ORDER BY date DESC, created_at DESC'
  ).all();
  return c.json({ success: true, data: results });
});

app.post('/api/collections', async (c) => {
  const { DB } = c.env;
  const body = await c.req.json();
  const id = `COL-${nanoid()}`;

  // Calculate rate based on fat/SNF
  const supplier = await DB.prepare('SELECT * FROM suppliers WHERE id = ?').bind(body.supplier_id).first() as any;
  if (!supplier) return c.json({ success: false, error: 'Supplier not found' }, 404);

  const base = supplier.rate;
  const calculated = Math.round(base * (body.fat + body.snf) / (6.0 + 8.5));
  const totalAmount = calculated * body.quantity;

  await DB.prepare(`
    INSERT INTO collections (id, supplier_id, supplier_name, date, shift, milk_type, quantity,
      fat, snf, rate, total_amount, remarks, temperature, vehicle_no, receiver_name, payment_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
  `).bind(
    id, body.supplier_id, supplier.name, today(), body.shift || 'Morning',
    body.milk_type || supplier.milk_source, body.quantity, body.fat, body.snf,
    calculated, totalAmount, body.remarks || '', body.temperature || 4.5,
    body.vehicle_no || 'N/A', body.receiver_name || 'Quality Inspector'
  ).run();

  // Update supplier outstanding
  await DB.prepare(
    'UPDATE suppliers SET outstanding_balance = outstanding_balance + ? WHERE id = ?'
  ).bind(totalAmount, body.supplier_id).run();

  await logAudit(DB, 'User', 'User', `Recorded milk collection ${id} from ${supplier.name} - ${body.quantity}L`);
  const newCol = await DB.prepare('SELECT * FROM collections WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: newCol }, 201);
});

app.delete('/api/collections/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  const existing = await DB.prepare('SELECT * FROM collections WHERE id = ?').bind(id).first() as any;
  if (!existing) return c.json({ success: false, error: 'Not found' }, 404);

  // Reverse supplier outstanding
  await DB.prepare(
    'UPDATE suppliers SET outstanding_balance = outstanding_balance - ? WHERE id = ?'
  ).bind(existing.total_amount, existing.supplier_id).run();

  await DB.prepare('DELETE FROM collections WHERE id = ?').bind(id).run();
  await logAudit(DB, 'Admin', 'Admin', `Deleted collection ${id}`);
  return c.json({ success: true, message: 'Deleted' });
});

// ─── INVENTORY ──────────────────────────────────────────────

app.get('/api/inventory', async (c) => {
  const { DB } = c.env;
  const { results } = await DB.prepare('SELECT * FROM inventory ORDER BY category, name').all();
  return c.json({ success: true, data: results });
});

app.post('/api/inventory', async (c) => {
  const { DB } = c.env;
  const body = await c.req.json();
  const id = `INV-${nanoid()}`;

  await DB.prepare(`
    INSERT INTO inventory (id, category, name, current_stock, unit, min_stock, expiry_date,
      batch_number, stock_in, stock_out, damaged_stock, returned_stock, price_per_unit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?)
  `).bind(
    id, body.category || 'Milk', body.name, body.current_stock || 0, body.unit || 'Litre',
    body.min_stock || 20, body.expiry_date || null, body.batch_number || null,
    body.current_stock || 0, body.price_per_unit || 0
  ).run();

  await logAudit(DB, 'Admin', 'Admin', `Added inventory item: ${body.name} (${id})`);
  const newItem = await DB.prepare('SELECT * FROM inventory WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: newItem }, 201);
});

// PATCH update inventory item (full edit)
app.patch('/api/inventory/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  const body = await c.req.json();
  const existing = await DB.prepare('SELECT * FROM inventory WHERE id = ?').bind(id).first() as any;
  if (!existing) return c.json({ success: false, error: 'Not found' }, 404);

  const name = body.name !== undefined ? body.name : existing.name;
  const category = body.category !== undefined ? body.category : existing.category;
  const unit = body.unit !== undefined ? body.unit : existing.unit;
  const minStock = body.min_stock !== undefined ? body.min_stock : existing.min_stock;
  const pricePerUnit = body.price_per_unit !== undefined ? body.price_per_unit : existing.price_per_unit;
  const expiryDate = body.expiry_date !== undefined ? body.expiry_date : existing.expiry_date;
  const batchNumber = body.batch_number !== undefined ? body.batch_number : existing.batch_number;
  const newStock = body.current_stock !== undefined ? body.current_stock : existing.current_stock;
  const newDamaged = body.damaged_stock !== undefined ? body.damaged_stock : existing.damaged_stock;
  const newReturned = body.returned_stock !== undefined ? body.returned_stock : existing.returned_stock;

  await DB.prepare(`
    UPDATE inventory SET name=?, category=?, unit=?, current_stock=?, min_stock=?, price_per_unit=?,
      expiry_date=?, batch_number=?, damaged_stock=?, returned_stock=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).bind(name, category, unit, newStock, minStock, pricePerUnit, expiryDate, batchNumber, newDamaged, newReturned, id).run();

  await logAudit(DB, 'Admin', 'Admin', `Updated inventory item: ${name}`);
  const updated = await DB.prepare('SELECT * FROM inventory WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: updated });
});

// ─── EXPENSES ───────────────────────────────────────────────

app.get('/api/expenses', async (c) => {
  const { DB } = c.env;
  const { results } = await DB.prepare('SELECT * FROM expenses ORDER BY date DESC').all();
  return c.json({ success: true, data: results });
});

app.post('/api/expenses', async (c) => {
  const { DB } = c.env;
  const body = await c.req.json();
  const id = `EXP-${nanoid()}`;

  await DB.prepare(`
    INSERT INTO expenses (id, category, amount, date, paid, paid_to, payment_method, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, body.category || 'General', body.amount, today(),
    body.paid !== undefined ? (body.paid ? 1 : 0) : 1,
    body.paid_to || null, body.payment_method || 'Cash', body.notes || null
  ).run();

  await logAudit(DB, 'Admin', 'Admin', `Recorded expense: ${body.category || 'General'} - PKR ${body.amount}`);
  const newExp = await DB.prepare('SELECT * FROM expenses WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: newExp }, 201);
});

app.delete('/api/expenses/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  await DB.prepare('DELETE FROM expenses WHERE id = ?').bind(id).run();
  await logAudit(DB, 'Admin', 'Admin', `Deleted expense ${id}`);
  return c.json({ success: true, message: 'Deleted' });
});

// PATCH /api/expenses/:id — toggle paid status
app.patch('/api/expenses/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  const body = await c.req.json();
  const existing = await DB.prepare('SELECT * FROM expenses WHERE id = ?').bind(id).first() as any;
  if (!existing) return c.json({ success: false, error: 'Not found' }, 404);
  const paid = body.paid !== undefined ? (body.paid ? 1 : 0) : existing.paid;
  await DB.prepare('UPDATE expenses SET paid=? WHERE id=?').bind(paid, id).run();
  const updated = await DB.prepare('SELECT * FROM expenses WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: updated });
});

// ─── EMPLOYEES ──────────────────────────────────────────────

app.get('/api/employees', async (c) => {
  const { DB } = c.env;
  const { results } = await DB.prepare('SELECT * FROM employees ORDER BY name').all();
  return c.json({ success: true, data: results });
});

app.post('/api/employees', async (c) => {
  const { DB } = c.env;
  const body = await c.req.json();
  const id = `EMP-${nanoid()}`;

  await DB.prepare(`
    INSERT INTO employees (id, name, phone, role, salary, attendance_today, leaves_taken, performance_score, permissions)
    VALUES (?, ?, ?, ?, ?, 'Not Marked', 0, 4.0, ?)
  `).bind(id, body.name, body.phone, body.role || 'Helper', body.salary || 20000,
    JSON.stringify(body.permissions || ['View Dashboard'])
  ).run();

  await logAudit(DB, 'Admin', 'Admin', `Registered new employee: ${body.name} as ${body.role}`);
  const newEmp = await DB.prepare('SELECT * FROM employees WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: newEmp }, 201);
});

// PATCH attendance
app.patch('/api/employees/:id/attendance', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  const { status } = await c.req.json();
  const emp = await DB.prepare('SELECT * FROM employees WHERE id = ?').bind(id).first() as any;
  if (!emp) return c.json({ success: false, error: 'Not found' }, 404);

  const leavesAdd = status === 'Leave' ? 1 : 0;
  await DB.prepare(
    'UPDATE employees SET attendance_today=?, leaves_taken=leaves_taken+?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).bind(status, leavesAdd, id).run();

  await logAudit(DB, 'Admin', 'Admin', `Marked ${emp.name} as ${status}`);
  const updated = await DB.prepare('SELECT * FROM employees WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: updated });
});

app.delete('/api/employees/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  const emp = await DB.prepare('SELECT name FROM employees WHERE id = ?').bind(id).first() as any;
  if (!emp) return c.json({ success: false, error: 'Not found' }, 404);
  await DB.prepare('DELETE FROM employees WHERE id = ?').bind(id).run();
  await logAudit(DB, 'Admin', 'Admin', `Removed employee: ${emp.name} (${id})`);
  return c.json({ success: true, message: 'Deleted' });
});

// ─── SETTINGS ───────────────────────────────────────────────

app.get('/api/settings', async (c) => {
  const { DB } = c.env;
  const { results } = await DB.prepare('SELECT * FROM settings').all();
  const settings: Record<string, string> = {};
  for (const row of results as any[]) {
    settings[row.key] = row.value;
  }
  return c.json({ success: true, data: settings });
});

app.post('/api/settings', async (c) => {
  const { DB } = c.env;
  const body = await c.req.json() as Record<string, string>;
  for (const [key, value] of Object.entries(body)) {
    await DB.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)').bind(key, value).run();
  }
  return c.json({ success: true, message: 'Settings saved' });
});

// ─── DASHBOARD KPIs ─────────────────────────────────────────

app.get('/api/dashboard', async (c) => {
  const { DB } = c.env;
  const todayStr = today();

  const [
    totalCustomers,
    totalSuppliers,
    todayCollection,
    lowStock,
    totalExpenses,
  ] = await Promise.all([
    DB.prepare('SELECT COUNT(*) as count FROM customers WHERE status="Active"').first() as Promise<any>,
    DB.prepare('SELECT COUNT(*) as count FROM suppliers WHERE status="Active"').first() as Promise<any>,
    DB.prepare('SELECT SUM(quantity) as qty, SUM(total_amount) as amount FROM collections WHERE date=?').bind(todayStr).first() as Promise<any>,
    DB.prepare('SELECT COUNT(*) as count FROM inventory WHERE current_stock <= min_stock').first() as Promise<any>,
    DB.prepare('SELECT SUM(amount) as amount FROM expenses').first() as Promise<any>,
  ]);

  const customerReceivables = await DB.prepare(
    'SELECT SUM(remaining_balance) as total FROM customers WHERE remaining_balance > 0'
  ).first() as any;

  const supplierPayables = await DB.prepare(
    'SELECT SUM(outstanding_balance) as total FROM suppliers'
  ).first() as any;

  const milkStock = await DB.prepare(
    'SELECT SUM(current_stock) as total FROM inventory WHERE category="Milk"'
  ).first() as any;

  return c.json({
    success: true,
    data: {
      total_customers: totalCustomers?.count || 0,
      total_suppliers: totalSuppliers?.count || 0,
      today_collection_qty: todayCollection?.qty || 0,
      today_collection_amount: todayCollection?.amount || 0,
      low_stock_count: lowStock?.count || 0,
      total_expenses: totalExpenses?.amount || 0,
      customer_receivables: customerReceivables?.total || 0,
      supplier_payables: supplierPayables?.total || 0,
      milk_stock_litres: milkStock?.total || 0,
    }
  });
});

// ─── REPORTS ────────────────────────────────────────────────

app.get('/api/reports/summary', async (c) => {
  const { DB } = c.env;

  const [collections, expenses] = await Promise.all([
    DB.prepare('SELECT SUM(total_amount) as total_purchase, SUM(quantity) as total_qty FROM collections').first() as Promise<any>,
    DB.prepare('SELECT SUM(amount) as total_expenses FROM expenses').first() as Promise<any>,
  ]);

  const netProfit = 0 - (expenses?.total_expenses || 0) - (collections?.total_purchase || 0);

  return c.json({
    success: true,
    data: {
      milk_purchase_cost: collections?.total_purchase || 0,
      total_milk_purchased: collections?.total_qty || 0,
      total_expenses: expenses?.total_expenses || 0,
      net_profit: netProfit,
    }
  });
});

// ─── AUTH ───────────────────────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// POST /api/login
app.post('/api/login', async (c) => {
  const { DB } = c.env;
  const { username, password } = await c.req.json();
  if (!username || !password) {
    return c.json({ success: false, error: 'Username and password required' });
  }
  const hash = await hashPassword(password);
  const user = await DB.prepare('SELECT * FROM users WHERE username = ? AND password_hash = ?')
    .bind(username, hash).first();
  if (!user) {
    return c.json({ success: false, error: 'Invalid username or password' });
  }
  return c.json({ success: true, data: { username: user.username, displayName: user.display_name, role: user.role } });
});

// PATCH /api/users/password
app.patch('/api/users/password', async (c) => {
  const { DB } = c.env;
  const { username, currentPassword, newPassword } = await c.req.json();
  if (!username || !currentPassword || !newPassword) {
    return c.json({ success: false, error: 'Missing required fields' });
  }
  if (newPassword.length < 4) {
    return c.json({ success: false, error: 'Password must be at least 4 characters' });
  }
  const currentHash = await hashPassword(currentPassword);
  const user = await DB.prepare('SELECT * FROM users WHERE username = ? AND password_hash = ?')
    .bind(username, currentHash).first();
  if (!user) {
    return c.json({ success: false, error: 'Current password is incorrect' });
  }
  const newHash = await hashPassword(newPassword);
  await DB.prepare('UPDATE users SET password_hash = ? WHERE username = ?')
    .bind(newHash, username).run();
  return c.json({ success: true, data: { message: 'Password updated successfully' } });
});

// GET /api/users (list users)
app.get('/api/users', async (c) => {
  const { DB } = c.env;
  const { results } = await DB.prepare('SELECT username, display_name, role FROM users ORDER BY username').all();
  return c.json({ success: true, data: results });
});

// POST /api/users (add user - admin only)
app.post('/api/users', async (c) => {
  const { DB } = c.env;
  const { username, password, displayName, role } = await c.req.json();
  if (!username || !password || !displayName || !role) {
    return c.json({ success: false, error: 'Missing required fields' });
  }
  const hash = await hashPassword(password);
  try {
    await DB.prepare('INSERT INTO users (username, password_hash, display_name, role) VALUES (?, ?, ?, ?)')
      .bind(username, hash, displayName, role).run();
    return c.json({ success: true, data: { username, displayName, role } });
  } catch (e: any) {
    return c.json({ success: false, error: 'Username already exists' });
  }
});

// PATCH /api/users/:username
app.patch('/api/users/:username', async (c) => {
  const { DB } = c.env;
  const existing = c.req.param('username');
  const { displayName, role } = await c.req.json();
  await DB.prepare('UPDATE users SET display_name = ?, role = ? WHERE username = ?')
    .bind(displayName, role, existing).run();
  return c.json({ success: true, data: { message: 'User updated' } });
});

// ─── DELIVERY SYSTEM ───────────────────────────────────────

// GET /api/delivery-customers
app.get('/api/delivery-customers', async (c) => {
  const { DB } = c.env;
  const { results } = await DB.prepare('SELECT * FROM delivery_customers ORDER BY name ASC').all();
  return c.json({ success: true, data: results });
});

// POST /api/delivery-customers
app.post('/api/delivery-customers', async (c) => {
  const { DB } = c.env;
  const body = await c.req.json();
  const id = `DEL-${Date.now()}`;
  await DB.prepare(`
    INSERT INTO delivery_customers (id, name, phone, alt_phone, colony, street, sector,
      house_no, address_line, milk_quantity, delivery_time, monthly_rate,
      bill_type, monthly_fee, pending_balance, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, body.name, body.phone, body.alt_phone || null,
    body.colony || null, body.street || null, body.sector || null,
    body.house_no || null, body.address_line || null,
    body.milk_quantity || 1, body.delivery_time || 'Morning',
    body.monthly_rate || 0, body.bill_type || 'per_litre',
    body.monthly_fee || 0, body.advance_payment || 0,
    body.notes || null, body.status || 'Active'
  ).run();
  const created = await DB.prepare('SELECT * FROM delivery_customers WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: created }, 201);
});

// PATCH /api/delivery-customers/:id
app.patch('/api/delivery-customers/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  const body = await c.req.json();
  const existing = await DB.prepare('SELECT * FROM delivery_customers WHERE id = ?').bind(id).first() as any;
  if (!existing) return c.json({ success: false, error: 'Not found' }, 404);

  const fields = ['name','phone','alt_phone','colony','street','sector','house_no',
    'address_line','milk_quantity','delivery_time','monthly_rate','bill_type',
    'monthly_fee','pending_balance','notes','status'];
  const setClauses: string[] = [];
  const values: any[] = [];
  for (const f of fields) {
    if (body[f] !== undefined) {
      setClauses.push(`${f}=?`);
      values.push(body[f]);
    }
  }
  if (!setClauses.length) return c.json({ success: false, error: 'No fields to update' });
  values.push(id);
  await DB.prepare(`UPDATE delivery_customers SET ${setClauses.join(', ')} WHERE id=?`).bind(...values).run();
  const updated = await DB.prepare('SELECT * FROM delivery_customers WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: updated });
});

// DELETE /api/delivery-customers/:id
app.delete('/api/delivery-customers/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  await DB.prepare('DELETE FROM delivery_records WHERE customer_id=?').bind(id).run();
  await DB.prepare('DELETE FROM delivery_payments WHERE customer_id=?').bind(id).run();
  await DB.prepare('DELETE FROM delivery_customers WHERE id=?').bind(id).run();
  return c.json({ success: true, message: 'Deleted' });
});

// GET /api/delivery-records?customer_id=X&month=YYYY-MM
app.get('/api/delivery-records', async (c) => {
  const { DB } = c.env;
  const customerId = c.req.query('customer_id');
  const month = c.req.query('month') || '';
  if (!customerId) return c.json({ success: false, error: 'customer_id required' }, 400);
  let query = 'SELECT * FROM delivery_records WHERE customer_id=?';
  const params: any[] = [customerId];
  if (month) {
    query += ' AND substr(date,1,7)=?';
    params.push(month);
  }
  query += ' ORDER BY date ASC';
  const { results } = await DB.prepare(query).bind(...params).all();
  return c.json({ success: true, data: results });
});

// POST /api/delivery-records
app.post('/api/delivery-records', async (c) => {
  const { DB } = c.env;
  const body = await c.req.json();
  const id = `DR-${Date.now()}`;
  await DB.prepare(`
    INSERT INTO delivery_records (id, customer_id, date, delivered, quantity, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(id, body.customer_id, body.date, body.delivered ? 1 : 0, body.quantity || null, body.notes || null).run();
  const created = await DB.prepare('SELECT * FROM delivery_records WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: created }, 201);
});

// PATCH /api/delivery-records/:id
app.patch('/api/delivery-records/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  const body = await c.req.json();
  const record = await DB.prepare('SELECT * FROM delivery_records WHERE id = ?').bind(id).first() as any;
  if (!record) return c.json({ success: false, error: 'Not found' }, 404);
  const delivered = body.delivered !== undefined ? (body.delivered ? 1 : 0) : record.delivered;
  const quantity = body.quantity !== undefined ? body.quantity : record.quantity;
  const notes = body.notes !== undefined ? body.notes : record.notes;
  await DB.prepare('UPDATE delivery_records SET delivered=?, quantity=?, notes=? WHERE id=?')
    .bind(delivered, quantity, notes, id).run();
  const updated = await DB.prepare('SELECT * FROM delivery_records WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: updated });
});

// GET /api/delivery-payments?customer_id=X
app.get('/api/delivery-payments', async (c) => {
  const { DB } = c.env;
  const customerId = c.req.query('customer_id');
  if (!customerId) return c.json({ success: false, error: 'customer_id required' }, 400);
  const { results } = await DB.prepare(
    'SELECT * FROM delivery_payments WHERE customer_id=? ORDER BY payment_date DESC'
  ).bind(customerId).all();
  return c.json({ success: true, data: results });
});

// POST /api/delivery-payments
app.post('/api/delivery-payments', async (c) => {
  const { DB } = c.env;
  const body = await c.req.json();
  const id = `DP-${Date.now()}`;
  const today = new Date().toISOString().split('T')[0];
  await DB.prepare(`
    INSERT INTO delivery_payments (id, customer_id, amount, month, payment_method, payment_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(id, body.customer_id, body.amount, body.month, body.payment_method || 'Cash', body.payment_date || today, body.notes || null).run();

  // Update customer pending balance
  await DB.prepare(
    'UPDATE delivery_customers SET pending_balance = pending_balance - ? WHERE id = ?'
  ).bind(body.amount, body.customer_id).run();

  const created = await DB.prepare('SELECT * FROM delivery_payments WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: created }, 201);
});

// ─── UTILITY ────────────────────────────────────────────────

async function logAudit(db: D1Database, user: string, role: string, action: string) {
  const id = `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  await db.prepare(`
    INSERT INTO audit_logs (id, user, role, action, ip_address, browser, timestamp)
    VALUES (?, ?, ?, ?, '127.0.0.1', 'System', ?)
  `).bind(id, user, role, action, new Date().toISOString()).run();
}

export const onRequest = handle(app);
