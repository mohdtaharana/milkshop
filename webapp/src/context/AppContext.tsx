import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  Customer, CustomerType,
  Supplier, MilkType,
  MilkCollection, Shift,
  InventoryItem, PaymentMethod,
  Expense, Employee,
  UserAccount, DeliveryCustomer, DeliveryRecord, DeliveryPayment
} from "../types";
import { translations } from "../translations";
import { useAuth } from "./AuthContext";

const API_BASE = "/api";

async function api(path: string, method = "GET", body?: object) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json() as any;
  if (!data.success) throw new Error(data.error || "API error");
  return data.data;
}

// Helper to convert snake_case DB fields → camelCase frontend fields
function toCamelCustomer(r: any): Customer {
  return {
    id: r.id, name: r.name, fatherName: r.father_name,
    phone: r.phone, altPhone: r.alt_phone, address: r.address,
    area: r.area, city: r.city, cnic: r.cnic,
    type: r.type as CustomerType,
    dailyQtyMorning: r.daily_qty_morning, dailyQtyEvening: r.daily_qty_evening,
    rate: r.rate, monthlyBillEstimate: r.monthly_bill_estimate,
    remainingBalance: r.remaining_balance, advancePayment: r.advance_payment,
    creditLimit: r.credit_limit, lastPaymentDate: r.last_payment_date,
    deliveryAddress: r.delivery_address, deliveryRouteId: r.delivery_route_id,
    status: r.status, notes: r.notes,
  };
}

function toCamelSupplier(r: any): Supplier {
  return {
    id: r.id, name: r.name, phone: r.phone, address: r.address,
    village: r.village, milkSource: r.milk_source as MilkType,
    morningSupply: r.morning_supply, eveningSupply: r.evening_supply,
    milkFat: r.milk_fat, snf: r.snf, rate: r.rate,
    purchaseQtyLimit: r.purchase_qty_limit,
    outstandingBalance: r.outstanding_balance,
    bankDetails: r.bank_name ? {
      bankName: r.bank_name, accountTitle: r.account_title, iban: r.iban
    } : undefined,
    status: r.status,
  };
}

function toCamelCollection(r: any): MilkCollection {
  return {
    id: r.id, supplierId: r.supplier_id, supplierName: r.supplier_name,
    date: r.date, shift: r.shift as Shift, milkType: r.milk_type as MilkType,
    quantity: r.quantity, fat: r.fat, snf: r.snf, rate: r.rate,
    totalAmount: r.total_amount, remarks: r.remarks, temperature: r.temperature,
    vehicleNo: r.vehicle_no, receiverName: r.receiver_name,
    paymentStatus: r.payment_status,
  };
}

function toCamelDeliveryCustomer(r: any): DeliveryCustomer {
  return {
    id: r.id, name: r.name, phone: r.phone, altPhone: r.alt_phone,
    colony: r.colony, street: r.street, sector: r.sector, houseNo: r.house_no,
    addressLine: r.address_line,
    milkQuantity: r.milk_quantity, deliveryTime: r.delivery_time,
    monthlyRate: r.monthly_rate, billType: r.bill_type as "per_litre" | "fixed_monthly",
    monthlyFee: r.monthly_fee, pendingBalance: r.pending_balance,
    notes: r.notes, status: r.status as "Active" | "Inactive",
    createdAt: r.created_at,
  };
}

function toCamelDeliveryRecord(r: any): DeliveryRecord {
  return {
    id: r.id, customerId: r.customer_id,
    date: r.date, delivered: !!r.delivered,
    quantity: r.quantity, notes: r.notes,
  };
}

function toCamelDeliveryPayment(r: any): DeliveryPayment {
  return {
    id: r.id, customerId: r.customer_id,
    amount: r.amount, month: r.month,
    paymentMethod: r.payment_method, paymentDate: r.payment_date,
    notes: r.notes,
  };
}

function toCamelInventory(r: any): InventoryItem {
  return {
    id: r.id, category: r.category, name: r.name,
    currentStock: r.current_stock, unit: r.unit, minStock: r.min_stock,
    expiryDate: r.expiry_date, batchNumber: r.batch_number,
    stockIn: r.stock_in, stockOut: r.stock_out,
    damagedStock: r.damaged_stock, returnedStock: r.returned_stock,
    pricePerUnit: r.price_per_unit,
  };
}

function toCamelExpense(r: any): Expense {
  return {
    id: r.id, category: r.category, amount: r.amount, date: r.date,
    paid: r.paid === 1 || r.paid === true,
    paidTo: r.paid_to, paymentMethod: r.payment_method, notes: r.notes,
  };
}

function toCamelEmployee(r: any): Employee {
  return {
    id: r.id, name: r.name, phone: r.phone, role: r.role,
    salary: r.salary, attendanceToday: r.attendance_today,
    leavesTaken: r.leaves_taken, performanceScore: r.performance_score,
    permissions: typeof r.permissions === "string" ? JSON.parse(r.permissions) : (r.permissions || []),
  };
}



// ─────────────────────────────────────────────────────────────────
interface AppContextProps {
  language: "en" | "ur";
  setLanguage: (lang: "en" | "ur") => void;
  direction: "ltr" | "rtl";
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  role: "Admin" | "User";
  setRole: (role: "Admin" | "User") => void;
  currentUser: { name: string; avatar: string };
  loading: boolean;

  // Database state
  customers: Customer[];
  suppliers: Supplier[];
  collections: MilkCollection[];
  inventory: InventoryItem[];
  deliveryCustomers: DeliveryCustomer[];
  deliveryRecords: DeliveryRecord[];
  deliveryPayments: DeliveryPayment[];
  expenses: Expense[];
  employees: Employee[];

  // Formatting utils
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number, decimals?: number) => string;
  formatDate: (dateStr: string) => string;

  // Actions
  addCustomer: (cust: Omit<Customer, "id" | "remainingBalance" | "monthlyBillEstimate">) => Promise<void>;
  updateCustomer: (id: string, cust: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  addSupplier: (supp: Omit<Supplier, "id" | "outstandingBalance">) => Promise<void>;
  updateSupplier: (id: string, supp: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;

  addCollection: (col: Omit<MilkCollection, "id" | "totalAmount" | "rate" | "date" | "receiverName">) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;

  updateInventoryStock: (id: string, currentStock: number, damagedStock?: number, returnedStock?: number) => Promise<void>;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, "id" | "stockIn" | "stockOut" | "damagedStock" | "returnedStock">) => Promise<void>;

  // Delivery actions
  addDeliveryCustomer: (c: Omit<DeliveryCustomer, "id" | "createdAt">) => Promise<void>;
  updateDeliveryCustomer: (id: string, c: Partial<DeliveryCustomer>) => Promise<void>;
  deleteDeliveryCustomer: (id: string) => Promise<void>;
  addDeliveryRecord: (r: Omit<DeliveryRecord, "id">) => Promise<void>;
  updateDeliveryRecord: (id: string, r: Partial<DeliveryRecord>) => Promise<void>;
  addDeliveryPayment: (p: Omit<DeliveryPayment, "id">) => Promise<void>;
  fetchDeliveryRecords: (customerId: string, month?: string) => Promise<any>;
  fetchDeliveryPayments: (customerId: string) => Promise<any>;

  addExpense: (exp: Omit<Expense, "id" | "date"> & { paidTo?: string, paid?: boolean }) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateExpense: (id: string, data: Partial<Expense>) => Promise<void>;

  addEmployee: (emp: Omit<Employee, "id" | "attendanceToday" | "leavesTaken" | "performanceScore">) => Promise<void>;
  toggleAttendance: (id: string, status: "Present" | "Absent" | "Leave" | "Late") => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;

  refreshAll: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // UI state
  const [language, setLanguageState] = useState<"en" | "ur">(() =>
    (localStorage.getItem("milkshop_lang") as "en" | "ur") || "en"
  );
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("milkshop_theme") as "light" | "dark" | null;
    if (saved) return saved;
    // Default to dark or follow system preference
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "dark";
  });
  const { user: authUser } = useAuth();
  const [role, setRole] = useState<"Admin" | "User">(authUser?.role || "Admin");
  const [currentUser, setCurrentUser] = useState({ name: authUser?.displayName || "User", avatar: authUser?.displayName?.charAt(0)?.toUpperCase() || "U" });
  const [loading, setLoading] = useState(true);

  // Data state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [collections, setCollections] = useState<MilkCollection[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [deliveryCustomers, setDeliveryCustomers] = useState<DeliveryCustomer[]>([]);
  const [deliveryRecords, setDeliveryRecords] = useState<DeliveryRecord[]>([]);
  const [deliveryPayments, setDeliveryPayments] = useState<DeliveryPayment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // ── Effects ──────────────────────────────────────────────
  useEffect(() => {
    if (authUser) {
      setCurrentUser({ name: authUser.displayName, avatar: authUser.displayName.charAt(0).toUpperCase() });
      setRole(authUser.role);
    }
  }, [authUser]);

  useEffect(() => {
    const dir = language === "ur" ? "rtl" : "ltr";
    setDirection(dir);
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    localStorage.setItem("milkshop_lang", language);
  }, [language]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    // Also update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "dark" ? "#020617" : "#f8fafc");
    }
    localStorage.setItem("milkshop_theme", theme);
  }, [theme]);

  const setLanguage = (lang: "en" | "ur") => setLanguageState(lang);
  const setTheme = (t: "light" | "dark") => setThemeState(t);

  // ── Fetch all data ─────────────────────────────────────────
  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [c, s, col, inv, exp, emp, dc] = await Promise.all([
        api("/customers"),
        api("/suppliers"),
        api("/collections"),
        api("/inventory"),
        api("/expenses"),
        api("/employees"),
        api("/delivery-customers"),
      ]);
      setCustomers((c || []).map(toCamelCustomer));
      setSuppliers((s || []).map(toCamelSupplier));
      setCollections((col || []).map(toCamelCollection));
      setInventory((inv || []).map(toCamelInventory));
      setExpenses((exp || []).map(toCamelExpense));
      setEmployees((emp || []).map(toCamelEmployee));
      setDeliveryCustomers((dc || []).map(toCamelDeliveryCustomer));
    } catch (e) {
      console.error("Failed to load data:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeliveryRecords = useCallback(async (customerId: string, month?: string) => {
    const params = new URLSearchParams({ customer_id: customerId });
    if (month) params.set('month', month);
    const data = await api(`/delivery-records?${params}`);
    setDeliveryRecords((data || []).map(toCamelDeliveryRecord));
    return data || [];
  }, []);

  const fetchDeliveryPayments = useCallback(async (customerId: string) => {
    const data = await api(`/delivery-payments?customer_id=${customerId}`);
    setDeliveryPayments((data || []).map(toCamelDeliveryPayment));
    return data || [];
  }, []);

  useEffect(() => { refreshAll(); }, [refreshAll]);

  // ── Translations ──────────────────────────────────────────
  const t = (key: string): string => {
    if (translations[key]) return translations[key][language] || key;
    return key;
  };

  const formatCurrency = (amount: number) =>
    `₨ ${Math.abs(amount).toLocaleString("en-PK", { minimumFractionDigits: 0 })}`;

  const formatNumber = (num: number, decimals = 0) =>
    num.toLocaleString("en-PK", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });
  };

  // ── Customer Actions ──────────────────────────────────────
  const addCustomer = async (cust: any) => {
    const result = await api("/customers", "POST", {
      name: cust.name, father_name: cust.fatherName, phone: cust.phone, alt_phone: cust.altPhone,
      address: cust.address, area: cust.area, city: cust.city, cnic: cust.cnic, type: cust.type,
      daily_qty_morning: cust.dailyQtyMorning, daily_qty_evening: cust.dailyQtyEvening,
      rate: cust.rate, advance_payment: cust.advancePayment, credit_limit: cust.creditLimit,
      delivery_address: cust.deliveryAddress, delivery_route_id: cust.deliveryRouteId,
      notes: cust.notes,
    });
    setCustomers(prev => [...prev, toCamelCustomer(result)]);
  };

  const updateCustomer = async (id: string, cust: Partial<Customer>) => {
    const result = await api(`/customers/${id}`, "PATCH", {
      name: cust.name, father_name: cust.fatherName, phone: cust.phone, alt_phone: cust.altPhone,
      address: cust.address, area: cust.area, city: cust.city, cnic: cust.cnic, type: cust.type,
      daily_qty_morning: cust.dailyQtyMorning, daily_qty_evening: cust.dailyQtyEvening,
      rate: cust.rate, remaining_balance: cust.remainingBalance, advance_payment: cust.advancePayment,
      credit_limit: cust.creditLimit, delivery_address: cust.deliveryAddress,
      delivery_route_id: cust.deliveryRouteId, status: cust.status, notes: cust.notes,
    });
    setCustomers(prev => prev.map(c => c.id === id ? toCamelCustomer(result) : c));
  };

  const deleteCustomer = async (id: string) => {
    await api(`/customers/${id}`, "DELETE");
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // ── Supplier Actions ──────────────────────────────────────
  const addSupplier = async (supp: any) => {
    const result = await api("/suppliers", "POST", {
      name: supp.name, phone: supp.phone, address: supp.address, village: supp.village,
      milk_source: supp.milkSource, morning_supply: supp.morningSupply,
      evening_supply: supp.eveningSupply, milk_fat: supp.milkFat, snf: supp.snf, rate: supp.rate,
      bank_name: supp.bankDetails?.bankName, account_title: supp.bankDetails?.accountTitle,
      iban: supp.bankDetails?.iban,
    });
    setSuppliers(prev => [...prev, toCamelSupplier(result)]);
  };

  const updateSupplier = async (id: string, supp: Partial<Supplier>) => {
    const result = await api(`/suppliers/${id}`, "PATCH", {
      name: supp.name, phone: supp.phone, address: supp.address, village: supp.village,
      milk_source: supp.milkSource, morning_supply: supp.morningSupply,
      evening_supply: supp.eveningSupply, milk_fat: supp.milkFat, snf: supp.snf, rate: supp.rate,
      outstanding_balance: supp.outstandingBalance, status: supp.status,
      bank_name: supp.bankDetails?.bankName, account_title: supp.bankDetails?.accountTitle,
      iban: supp.bankDetails?.iban,
    });
    setSuppliers(prev => prev.map(s => s.id === id ? toCamelSupplier(result) : s));
  };

  const deleteSupplier = async (id: string) => {
    await api(`/suppliers/${id}`, "DELETE");
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  // ── Collection Actions ────────────────────────────────────
  const addCollection = async (col: any) => {
    const result = await api("/collections", "POST", {
      supplier_id: col.supplierId, shift: col.shift,
      milk_type: col.milkType, quantity: col.quantity, fat: col.fat, snf: col.snf,
      remarks: col.remarks, temperature: col.temperature, vehicle_no: col.vehicleNo,
    });
    setCollections(prev => [toCamelCollection(result), ...prev]);
    // Refresh suppliers for updated balance
    const updated = await api("/suppliers");
    setSuppliers((updated || []).map(toCamelSupplier));
  };

  const deleteCollection = async (id: string) => {
    await api(`/collections/${id}`, "DELETE");
    setCollections(prev => prev.filter(c => c.id !== id));
    const updated = await api("/suppliers");
    setSuppliers((updated || []).map(toCamelSupplier));
  };

  // ── Inventory Actions ─────────────────────────────────────
  const addInventoryItem = async (item: any) => {
    const result = await api("/inventory", "POST", {
      name: item.name, category: item.category, unit: item.unit,
      current_stock: item.currentStock, min_stock: item.minStock,
      price_per_unit: item.pricePerUnit, expiry_date: item.expiryDate,
      batch_number: item.batchNumber,
    });
    setInventory(prev => [...prev, toCamelInventory(result)]);
  };

  const updateInventoryStock = async (id: string, currentStock: number, damagedStock?: number, returnedStock?: number) => {
    const result = await api(`/inventory/${id}`, "PATCH", {
      current_stock: currentStock,
      damaged_stock: damagedStock,
      returned_stock: returnedStock,
    });
    setInventory(prev => prev.map(i => i.id === id ? toCamelInventory(result) : i));
  };

  const updateInventoryItem = async (id: string, item: Partial<InventoryItem>) => {
    const result = await api(`/inventory/${id}`, "PATCH", {
      name: item.name, category: item.category, unit: item.unit,
      current_stock: item.currentStock, min_stock: item.minStock,
      price_per_unit: item.pricePerUnit, expiry_date: item.expiryDate,
      batch_number: item.batchNumber, damaged_stock: item.damagedStock,
      returned_stock: item.returnedStock,
    });
    setInventory(prev => prev.map(i => i.id === id ? toCamelInventory(result) : i));
  };

  // ── Delivery Customer Actions ──────────────────────────────
  const addDeliveryCustomer = async (cust: any) => {
    const result = await api("/delivery-customers", "POST", {
      name: cust.name, phone: cust.phone, alt_phone: cust.altPhone,
      colony: cust.colony, street: cust.street, sector: cust.sector,
      house_no: cust.houseNo, address_line: cust.addressLine,
      milk_quantity: cust.milkQuantity, delivery_time: cust.deliveryTime,
      monthly_rate: cust.monthlyRate, bill_type: cust.billType,
      monthly_fee: cust.monthlyFee, pending_balance: cust.pendingBalance || 0,
      notes: cust.notes, status: cust.status || 'Active',
    });
    setDeliveryCustomers(prev => [...prev, toCamelDeliveryCustomer(result)]);
  };

  const updateDeliveryCustomer = async (id: string, cust: Partial<DeliveryCustomer>) => {
    const result = await api(`/delivery-customers/${id}`, "PATCH", {
      name: cust.name, phone: cust.phone, alt_phone: cust.altPhone,
      colony: cust.colony, street: cust.street, sector: cust.sector,
      house_no: cust.houseNo, address_line: cust.addressLine,
      milk_quantity: cust.milkQuantity, delivery_time: cust.deliveryTime,
      monthly_rate: cust.monthlyRate, bill_type: cust.billType,
      monthly_fee: cust.monthlyFee, pending_balance: cust.pendingBalance,
      notes: cust.notes, status: cust.status,
    });
    setDeliveryCustomers(prev => prev.map(c => c.id === id ? toCamelDeliveryCustomer(result) : c));
  };

  const deleteDeliveryCustomer = async (id: string) => {
    await api(`/delivery-customers/${id}`, "DELETE");
    setDeliveryCustomers(prev => prev.filter(c => c.id !== id));
    setDeliveryRecords(prev => prev.filter(r => r.customerId !== id));
    setDeliveryPayments(prev => prev.filter(p => p.customerId !== id));
  };

  const addDeliveryRecord = async (rec: any) => {
    const result = await api("/delivery-records", "POST", {
      customer_id: rec.customerId, date: rec.date,
      delivered: rec.delivered, quantity: rec.quantity, notes: rec.notes,
    });
    setDeliveryRecords(prev => [...prev, toCamelDeliveryRecord(result)]);
  };

  const updateDeliveryRecord = async (id: string, rec: Partial<DeliveryRecord>) => {
    const result = await api(`/delivery-records/${id}`, "PATCH", {
      delivered: rec.delivered, quantity: rec.quantity, notes: rec.notes,
    });
    setDeliveryRecords(prev => prev.map(r => r.id === id ? toCamelDeliveryRecord(result) : r));
  };

  const addDeliveryPayment = async (pay: any) => {
    const result = await api("/delivery-payments", "POST", {
      customer_id: pay.customerId, amount: pay.amount,
      month: pay.month, payment_method: pay.paymentMethod,
      payment_date: pay.paymentDate, notes: pay.notes,
    });
    setDeliveryPayments(prev => [toCamelDeliveryPayment(result), ...prev]);
    // Refresh customers for updated balance
    const updated = await api("/delivery-customers");
    setDeliveryCustomers((updated || []).map(toCamelDeliveryCustomer));
  };

  // ── Expense Actions ───────────────────────────────────────
  const addExpense = async (exp: any) => {
    const result = await api("/expenses", "POST", {
      category: exp.category, amount: exp.amount, paid: exp.paid,
      paid_to: exp.paidTo, payment_method: exp.paymentMethod || "Cash", notes: exp.notes,
    });
    setExpenses(prev => [toCamelExpense(result), ...prev]);
  };

  const deleteExpense = async (id: string) => {
    await api(`/expenses/${id}`, "DELETE");
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const updateExpense = async (id: string, data: Partial<Expense>) => {
    const result = await api(`/expenses/${id}`, "PATCH", { paid: data.paid });
    setExpenses(prev => prev.map(e => e.id === id ? toCamelExpense(result) : e));
  };

  // ── Employee Actions ──────────────────────────────────────
  const addEmployee = async (emp: any) => {
    const result = await api("/employees", "POST", {
      name: emp.name, phone: emp.phone, role: emp.role, salary: emp.salary,
      permissions: emp.permissions,
    });
    setEmployees(prev => [...prev, toCamelEmployee(result)]);
  };

  const toggleAttendance = async (id: string, status: "Present" | "Absent" | "Leave" | "Late") => {
    const result = await api(`/employees/${id}/attendance`, "PATCH", { status });
    setEmployees(prev => prev.map(e => e.id === id ? toCamelEmployee(result) : e));
  };

  const deleteEmployee = async (id: string) => {
    await api(`/employees/${id}`, "DELETE");
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage, direction, theme, setTheme, role, setRole, currentUser, loading,
      customers, suppliers, collections, inventory, deliveryCustomers, deliveryRecords, deliveryPayments,
      expenses, employees,
      t, formatCurrency, formatNumber, formatDate,
      addCustomer, updateCustomer, deleteCustomer,
      addSupplier, updateSupplier, deleteSupplier,
      addCollection, deleteCollection,
      updateInventoryStock, updateInventoryItem, addInventoryItem,
      addDeliveryCustomer, updateDeliveryCustomer, deleteDeliveryCustomer,
      addDeliveryRecord, updateDeliveryRecord, addDeliveryPayment,
      fetchDeliveryRecords, fetchDeliveryPayments,
      addExpense, updateExpense, deleteExpense,
      addEmployee, toggleAttendance, deleteEmployee,
      refreshAll,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
