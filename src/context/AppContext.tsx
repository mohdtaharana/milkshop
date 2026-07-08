/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Customer, CustomerType, 
  Supplier, MilkType, 
  MilkCollection, Shift, 
  InventoryItem, Invoice, PaymentMethod, InvoiceProduct,
  Expense, Employee, DeliveryRoute, PaymentRecord, AuditLog, Notification 
} from "../types";
import { translations } from "../translations";

interface AppContextProps {
  language: "en" | "ur";
  setLanguage: (lang: "en" | "ur") => void;
  direction: "ltr" | "rtl";
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  role: "Admin" | "User";
  setRole: (role: "Admin" | "User") => void;
  currentUser: { name: string; avatar: string };
  
  // Database state
  customers: Customer[];
  suppliers: Supplier[];
  collections: MilkCollection[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  expenses: Expense[];
  employees: Employee[];
  routes: DeliveryRoute[];
  payments: PaymentRecord[];
  auditLogs: AuditLog[];
  notifications: Notification[];
  
  // Formatting utils
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number, decimals?: number) => string;
  formatDate: (dateStr: string) => string;
  
  // Actions
  addCustomer: (cust: Omit<Customer, "id" | "remainingBalance" | "monthlyBillEstimate">) => void;
  updateCustomer: (id: string, cust: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  addSupplier: (supp: Omit<Supplier, "id" | "outstandingBalance">) => void;
  updateSupplier: (id: string, supp: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  addCollection: (col: Omit<MilkCollection, "id" | "totalAmount" | "rate" | "date" | "receiverName">) => void;
  deleteCollection: (id: string) => void;
  
  updateInventoryStock: (id: string, currentStock: number, damagedStock?: number, returnedStock?: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, "id" | "stockIn" | "stockOut" | "damagedStock" | "returnedStock">) => void;
  
  addInvoice: (inv: Omit<Invoice, "id" | "invoiceNumber" | "date" | "total" | "remaining" | "customerName">) => void;
  cancelInvoice: (id: string) => void;
  
  addExpense: (exp: Omit<Expense, "id" | "date">) => void;
  
  addEmployee: (emp: Omit<Employee, "id" | "attendanceToday" | "leavesTaken" | "performanceScore">) => void;
  toggleAttendance: (id: string, status: "Present" | "Absent" | "Leave" | "Late") => void;
  deleteEmployee: (id: string) => void;
  
  addPayment: (pay: Omit<PaymentRecord, "id" | "date" | "remainingBalance">) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Locale state
  const [language, setLanguageState] = useState<"en" | "ur">(() => {
    return (localStorage.getItem("subhanallah_lang") as "en" | "ur") || "en";
  });
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  
  // Theme state
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("subhanallah_theme") as "light" | "dark") || "light";
  });
  
  // Role State
  const [role, setRole] = useState<"Admin" | "User">("Admin");
  const [currentUser, setCurrentUser] = useState({ name: "Subhan Ahmed", avatar: "SA" });

  useEffect(() => {
    if (role === "Admin") {
      setCurrentUser({ name: "Subhan Ahmed", avatar: "SA" });
    } else {
      setCurrentUser({ name: "Ali Raza (Operator)", avatar: "AR" });
    }
  }, [role]);

  // Adjust HTML dir and tailwind theme class
  useEffect(() => {
    const dir = language === "ur" ? "rtl" : "ltr";
    setDirection(dir);
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    localStorage.setItem("subhanallah_lang", language);
  }, [language]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("subhanallah_theme", theme);
  }, [theme]);

  const setLanguage = (lang: "en" | "ur") => {
    setLanguageState(lang);
    addAuditLog("System", `Changed interface language to ${lang === "en" ? "English" : "Urdu"}`);
  };

  const setTheme = (t: "light" | "dark") => {
    setThemeState(t);
    addAuditLog("System", `Switched theme preference to ${t}`);
  };

  // --- MOCK DATABASE SEED DATA ---

  // 1. Customers
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "CUST-001",
      name: "Muhammad Ali Butt",
      fatherName: "Tariq Butt",
      phone: "0300-1234567",
      altPhone: "0321-7654321",
      address: "House 24, Street 2, Samanabad",
      area: "Samanabad",
      city: "Lahore",
      cnic: "35202-1234567-9",
      type: CustomerType.RESIDENTIAL,
      dailyQtyMorning: 4,
      dailyQtyEvening: 2,
      rate: 190,
      monthlyBillEstimate: 34200,
      remainingBalance: 4500, // receivable
      advancePayment: 0,
      creditLimit: 15000,
      lastPaymentDate: "2026-07-01",
      deliveryAddress: "House 24, Street 2, Samanabad",
      deliveryRouteId: "ROUTE-01",
      status: "Active",
      notes: "Regular customer, prefers delivery before 7:00 AM."
    },
    {
      id: "CUST-002",
      name: "Gourmet Bakery & Sweets",
      fatherName: "N/A",
      phone: "0312-9988776",
      address: "Main Boulevard, Johar Town",
      area: "Johar Town",
      city: "Lahore",
      cnic: "35201-9876543-1",
      type: CustomerType.BAKERY,
      dailyQtyMorning: 150,
      dailyQtyEvening: 100,
      rate: 180,
      monthlyBillEstimate: 1350000,
      remainingBalance: 125000,
      advancePayment: 0,
      creditLimit: 300000,
      lastPaymentDate: "2026-07-05",
      deliveryAddress: "Johar Town Branch Kitchen",
      deliveryRouteId: "ROUTE-03",
      status: "Active",
      notes: "Commercial rate applied. Bulk supplier."
    },
    {
      id: "CUST-003",
      name: "Yasir Broast & Restaurant",
      fatherName: "Bashir Ahmad",
      phone: "0321-4567890",
      address: "Main Market, Gulberg III",
      area: "Gulberg",
      city: "Lahore",
      cnic: "35202-4567890-5",
      type: CustomerType.RESTAURANT,
      dailyQtyMorning: 50,
      dailyQtyEvening: 60,
      rate: 185,
      monthlyBillEstimate: 610500,
      remainingBalance: 82000,
      advancePayment: 0,
      creditLimit: 150000,
      lastPaymentDate: "2026-06-29",
      deliveryAddress: "Gulberg Branch Kitchen",
      deliveryRouteId: "ROUTE-02",
      status: "Active",
      notes: "Requires high-fat mixed milk for cooking."
    },
    {
      id: "CUST-004",
      name: "Al-Hamdu Tea Stall",
      fatherName: "Ghulam Farid",
      phone: "0333-8822114",
      address: "Shop #12, Anarkali Bazaar",
      area: "Anarkali",
      city: "Lahore",
      cnic: "35201-5432109-3",
      type: CustomerType.TEA_STALL,
      dailyQtyMorning: 40,
      dailyQtyEvening: 40,
      rate: 182,
      monthlyBillEstimate: 436800,
      remainingBalance: -15000, // advance
      advancePayment: 15000,
      creditLimit: 50000,
      lastPaymentDate: "2026-07-06",
      deliveryAddress: "Shop #12, Anarkali Bazaar",
      deliveryRouteId: "ROUTE-01",
      status: "Active",
      notes: "Pays daily or in short weekly advances."
    },
    {
      id: "CUST-005",
      name: "Chaudhary Milk Collection Point",
      fatherName: "Chaudhary Aslam",
      phone: "0345-6677889",
      address: "Kasur Bypass Road",
      area: "Bypass",
      city: "Kasur",
      cnic: "35102-1234432-7",
      type: CustomerType.COLLECTION_POINT,
      dailyQtyMorning: 0,
      dailyQtyEvening: 500,
      rate: 175,
      monthlyBillEstimate: 2625000,
      remainingBalance: 410000,
      advancePayment: 0,
      creditLimit: 500000,
      lastPaymentDate: "2026-07-02",
      deliveryAddress: "Bypass Collection Center",
      deliveryRouteId: "ROUTE-04",
      status: "Active",
      notes: "Collects bulk buffalo milk directly from village route."
    },
    {
      id: "CUST-006",
      name: "Zafar Iqbal Hotel",
      fatherName: "Zafar Iqbal",
      phone: "0300-9988123",
      address: "Sector C, DHA Phase 5",
      area: "DHA Phase 5",
      city: "Lahore",
      cnic: "35201-8722134-9",
      type: CustomerType.HOTEL,
      dailyQtyMorning: 30,
      dailyQtyEvening: 30,
      rate: 188,
      monthlyBillEstimate: 338400,
      remainingBalance: 14000,
      advancePayment: 0,
      creditLimit: 60000,
      lastPaymentDate: "2026-07-04",
      deliveryAddress: "DHA Branch Backgate delivery",
      deliveryRouteId: "ROUTE-03",
      status: "Active",
      notes: "Strict timing. Morning before 6 AM, evening before 5 PM."
    }
  ]);

  // 2. Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "SUPP-001",
      name: "Chaudhary Rehmat Ali",
      phone: "0300-8432112",
      address: "Dera Rehmat Ali, Chak 14-GD",
      village: "Chak 14-GD",
      milkSource: MilkType.BUFFALO,
      morningSupply: 320,
      eveningSupply: 280,
      milkFat: 6.8,
      snf: 9.0,
      rate: 162,
      outstandingBalance: 145000,
      bankDetails: {
        bankName: "Habib Bank Limited (HBL)",
        accountTitle: "Rehmat Ali Dairy Farm",
        iban: "PK72HABB0001002345678901"
      },
      status: "Active"
    },
    {
      id: "SUPP-002",
      name: "Malik Mumtaz Dairy Farm",
      phone: "0301-4433221",
      address: "Mumtaz Farmhouse, Kasur Rural",
      village: "Kasur Rural",
      milkSource: MilkType.MIXED,
      morningSupply: 450,
      eveningSupply: 400,
      milkFat: 5.8,
      snf: 8.7,
      rate: 155,
      outstandingBalance: 280000,
      bankDetails: {
        bankName: "National Bank of Pakistan (NBP)",
        accountTitle: "Mumtaz Ahmad",
        iban: "PK11NBPB0002009876543210"
      },
      status: "Active"
    },
    {
      id: "SUPP-003",
      name: "Sardar Muhammad Khan",
      phone: "0323-9988111",
      address: "Dera Sardar, Okara Rural",
      village: "Okara Rural",
      milkSource: MilkType.COW,
      morningSupply: 250,
      eveningSupply: 200,
      milkFat: 4.2,
      snf: 8.5,
      rate: 140,
      outstandingBalance: 85000,
      bankDetails: {
        bankName: "Meezan Bank Limited",
        accountTitle: "Sardar Muhammad Khan",
        iban: "PK55MEZN0003005544332211"
      },
      status: "Active"
    }
  ]);

  // 3. Milk Collection Records
  const [collections, setCollections] = useState<MilkCollection[]>([
    {
      id: "COL-001",
      supplierId: "SUPP-001",
      supplierName: "Chaudhary Rehmat Ali",
      date: "2026-07-07",
      shift: Shift.MORNING,
      milkType: MilkType.BUFFALO,
      quantity: 325,
      fat: 6.9,
      snf: 9.1,
      rate: 165,
      totalAmount: 53625,
      remarks: "Excellent high-density buffalo milk. Cold chain maintained.",
      temperature: 4.2,
      vehicleNo: "LES-9921",
      receiverName: "Quality Inspector Ali",
      paymentStatus: "Pending"
    },
    {
      id: "COL-002",
      supplierId: "SUPP-002",
      supplierName: "Malik Mumtaz Dairy Farm",
      date: "2026-07-07",
      shift: Shift.MORNING,
      milkType: MilkType.MIXED,
      quantity: 440,
      fat: 5.7,
      snf: 8.6,
      rate: 154,
      totalAmount: 67760,
      remarks: "Clean mixed milk. Water addition tested: 0%.",
      temperature: 5.0,
      vehicleNo: "KAS-1212",
      receiverName: "Quality Inspector Ali",
      paymentStatus: "Pending"
    },
    {
      id: "COL-003",
      supplierId: "SUPP-003",
      supplierName: "Sardar Muhammad Khan",
      date: "2026-07-07",
      shift: Shift.MORNING,
      milkType: MilkType.COW,
      quantity: 260,
      fat: 4.1,
      snf: 8.4,
      rate: 138,
      totalAmount: 35880,
      remarks: "Good quality cow milk, light yellow tint.",
      temperature: 6.1,
      vehicleNo: "OKA-889",
      receiverName: "Quality Inspector Ali",
      paymentStatus: "Paid"
    },
    {
      id: "COL-004",
      supplierId: "SUPP-001",
      supplierName: "Chaudhary Rehmat Ali",
      date: "2026-07-06",
      shift: Shift.EVENING,
      milkType: MilkType.BUFFALO,
      quantity: 290,
      fat: 6.7,
      snf: 8.9,
      rate: 161,
      totalAmount: 46690,
      remarks: "Standard evening milk. Temperature slightly high.",
      temperature: 7.8,
      vehicleNo: "LES-9921",
      receiverName: "Assistant Shahzad",
      paymentStatus: "Pending"
    },
    {
      id: "COL-005",
      supplierId: "SUPP-002",
      supplierName: "Malik Mumtaz Dairy Farm",
      date: "2026-07-06",
      shift: Shift.EVENING,
      milkType: MilkType.MIXED,
      quantity: 410,
      fat: 5.9,
      snf: 8.8,
      rate: 156,
      totalAmount: 63960,
      remarks: "Good rich evening supply.",
      temperature: 4.9,
      vehicleNo: "KAS-1212",
      receiverName: "Assistant Shahzad",
      paymentStatus: "Pending"
    }
  ]);

  // 4. Inventory
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "INV-001", category: "Milk", name: "Buffalo Milk (Raw Fresh)", currentStock: 820, unit: "Litre", minStock: 200, stockIn: 1200, stockOut: 380, damagedStock: 0, returnedStock: 0, pricePerUnit: 195 },
    { id: "INV-002", category: "Milk", name: "Cow Milk (Raw Fresh)", currentStock: 310, unit: "Litre", minStock: 100, stockIn: 500, stockOut: 190, damagedStock: 0, returnedStock: 0, pricePerUnit: 180 },
    { id: "INV-003", category: "Yogurt", name: "Sweet Thick Yogurt (Kunda)", currentStock: 145, unit: "Kg", minStock: 30, stockIn: 250, stockOut: 105, damagedStock: 2, returnedStock: 1, pricePerUnit: 240 },
    { id: "INV-004", category: "Yogurt", name: "Khalsa Plain Yogurt", currentStock: 110, unit: "Kg", minStock: 30, stockIn: 180, stockOut: 70, damagedStock: 0, returnedStock: 0, pricePerUnit: 220 },
    { id: "INV-005", category: "Butter", name: "Desi Unsalted White Butter", currentStock: 42, unit: "Kg", minStock: 15, stockIn: 60, stockOut: 18, damagedStock: 0, returnedStock: 0, pricePerUnit: 1200 },
    { id: "INV-006", category: "Cream", name: "Fresh Thick Cream (Malai)", currentStock: 18, unit: "Kg", minStock: 10, stockIn: 40, stockOut: 22, damagedStock: 1, returnedStock: 0, pricePerUnit: 650 },
    { id: "INV-007", category: "Desi Ghee", name: "Premium Fragrant Desi Ghee", currentStock: 85, unit: "Kg", minStock: 20, stockIn: 120, stockOut: 35, damagedStock: 0, returnedStock: 0, pricePerUnit: 2400 },
    { id: "INV-008", category: "Lassi", name: "Namkeen Chati ki Lassi", currentStock: 120, unit: "Litre", minStock: 40, stockIn: 300, stockOut: 180, damagedStock: 5, returnedStock: 0, pricePerUnit: 110 },
    { id: "INV-009", category: "Packaging", name: "Subhanallah Poly Bags (1 Litre)", currentStock: 4500, unit: "Unit", minStock: 1000, stockIn: 10000, stockOut: 5500, damagedStock: 12, returnedStock: 0, pricePerUnit: 1.5 },
    { id: "INV-010", category: "Packaging", name: "Plastic Bottles (1.5 Litre with Caps)", currentStock: 850, unit: "Unit", minStock: 200, stockIn: 1500, stockOut: 650, damagedStock: 3, returnedStock: 0, pricePerUnit: 12 }
  ]);

  // 5. Invoices / Sales Billing
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-20260707-001",
      invoiceNumber: "SUB-INV-10201",
      customerId: "CUST-002",
      customerName: "Gourmet Bakery & Sweets",
      date: "2026-07-07",
      products: [
        { productId: "INV-001", name: "Buffalo Milk (Raw Fresh)", quantity: 150, unit: "Litre", rate: 180, amount: 27000 },
        { productId: "INV-003", name: "Sweet Thick Yogurt (Kunda)", quantity: 20, unit: "Kg", rate: 240, amount: 4800 },
        { productId: "INV-007", name: "Premium Fragrant Desi Ghee", quantity: 5, unit: "Kg", rate: 2400, amount: 12000 }
      ],
      milkQuantity: 150,
      rate: 180,
      discount: 1500,
      tax: 1750,
      extraCharges: 500,
      total: 44550,
      paid: 40000,
      remaining: 4550,
      paymentMethod: PaymentMethod.CASH,
      status: "Partially Paid"
    },
    {
      id: "INV-20260707-002",
      invoiceNumber: "SUB-INV-10202",
      customerId: "CUST-004",
      customerName: "Al-Hamdu Tea Stall",
      date: "2026-07-07",
      products: [
        { productId: "INV-001", name: "Buffalo Milk (Raw Fresh)", quantity: 40, unit: "Litre", rate: 182, amount: 7280 }
      ],
      milkQuantity: 40,
      rate: 182,
      discount: 280,
      tax: 0,
      extraCharges: 0,
      total: 7000,
      paid: 7000,
      remaining: 0,
      paymentMethod: PaymentMethod.EASYPAISA,
      status: "Paid"
    },
    {
      id: "INV-20260707-003",
      invoiceNumber: "SUB-INV-10203",
      customerId: "CUST-003",
      customerName: "Yasir Broast & Restaurant",
      date: "2026-07-07",
      products: [
        { productId: "INV-001", name: "Buffalo Milk (Raw Fresh)", quantity: 50, unit: "Litre", rate: 185, amount: 9250 },
        { productId: "INV-006", name: "Fresh Thick Cream (Malai)", quantity: 10, unit: "Kg", rate: 650, amount: 6500 }
      ],
      milkQuantity: 50,
      rate: 185,
      discount: 500,
      tax: 600,
      extraCharges: 300,
      total: 16150,
      paid: 0,
      remaining: 16150,
      paymentMethod: PaymentMethod.CREDIT,
      status: "Unpaid"
    },
    {
      id: "INV-20260706-004",
      invoiceNumber: "SUB-INV-10199",
      customerId: "CUST-001",
      customerName: "Muhammad Ali Butt",
      date: "2026-07-06",
      products: [
        { productId: "INV-001", name: "Buffalo Milk (Raw Fresh)", quantity: 6, unit: "Litre", rate: 190, amount: 1140 }
      ],
      milkQuantity: 6,
      rate: 190,
      discount: 0,
      tax: 0,
      extraCharges: 60,
      total: 1200,
      paid: 1200,
      remaining: 0,
      paymentMethod: PaymentMethod.JAZZCASH,
      status: "Paid"
    }
  ]);

  // 6. Expenses
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "EXP-001", category: "Electricity", amount: 48500, date: "2026-07-02", paidTo: "LESCO Lahore", paymentMethod: "Bank Transfer", notes: "Commercial electric bill for deep-cooling tanks & shop." },
    { id: "EXP-002", category: "Rent", amount: 65000, date: "2026-07-01", paidTo: "Haji Abdul Ghaffar", paymentMethod: "Cash", notes: "Main shop rental for the month of July." },
    { id: "EXP-003", category: "Vehicle Fuel", amount: 18000, date: "2026-07-05", paidTo: "Shell Fuel Station", paymentMethod: "JazzCash", notes: "Fuel for milk pickup loader and delivery boys." },
    { id: "EXP-004", category: "Packaging", amount: 15000, date: "2026-07-04", paidTo: "Pak Plastic Industries", paymentMethod: "Bank Transfer", notes: "Bulk purchase of printed 1L polybags." },
    { id: "EXP-005", category: "Cleaning", amount: 4500, date: "2026-07-06", paidTo: "Staff Handout", paymentMethod: "Cash", notes: "Food grade sanitizers and chemicals for tank washing." }
  ]);

  // 7. Staff Management
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "EMP-001", name: "Ali Raza", phone: "0300-4567123", role: "Manager", salary: 55000, attendanceToday: "Present", leavesTaken: 1, performanceScore: 4.8, permissions: ["View Dashboard", "Record Collection", "Create Invoices", "Manage Expenses"] },
    { id: "EMP-002", name: "Tariq Mahmood", phone: "0313-7722113", role: "Quality Tester", salary: 38000, attendanceToday: "Present", leavesTaken: 0, performanceScore: 4.5, permissions: ["Record Collection"] },
    { id: "EMP-003", name: "Zubair Ahmad", phone: "0345-8811990", role: "Delivery Boy", salary: 25000, attendanceToday: "Present", leavesTaken: 2, performanceScore: 4.2, permissions: [] },
    { id: "EMP-004", name: "Kamran Shah", phone: "0321-5553331", role: "Delivery Boy", salary: 25000, attendanceToday: "Absent", leavesTaken: 3, performanceScore: 3.9, permissions: [] },
    { id: "EMP-005", name: "Noman Malik", phone: "0333-1234321", role: "Helper", salary: 20000, attendanceToday: "Present", leavesTaken: 1, performanceScore: 4.0, permissions: [] }
  ]);

  // 8. Delivery Routes
  const [routes, setRoutes] = useState<DeliveryRoute[]>([
    { id: "ROUTE-01", routeName: "Samanabad & Anarkali Inner Ring", driverName: "Saeed Anwar", deliveryBoyName: "Zubair Ahmad", vehicleNo: "LEH-8822 (Chingchi Loader)", totalDeliveries: 12, completedDeliveries: 12, status: "Completed" },
    { id: "ROUTE-02", routeName: "Gulberg III Main Sector & Cavalry", driverName: "Asif Javed", deliveryBoyName: "Self Pickup / Dispatch", vehicleNo: "LES-1232 (Suzuki Bolan)", totalDeliveries: 8, completedDeliveries: 6, status: "Active" },
    { id: "ROUTE-03", routeName: "DHA Phase 5 & Johar Town Express", driverName: "Zafar Iqbal", deliveryBoyName: "Kamran Shah", vehicleNo: "LED-5544 (Chingchi Loader)", totalDeliveries: 15, completedDeliveries: 11, status: "Active" },
    { id: "ROUTE-04", routeName: "Kasur Outskirts Collection Route", driverName: "Chaudhary Aslam", deliveryBoyName: "Staff Loader", vehicleNo: "KAS-9988 (Milk Tanker Truck)", totalDeliveries: 5, completedDeliveries: 5, status: "Completed" }
  ]);

  // 9. Payment Ledger
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  // 10. Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: "LOG-001", user: "Subhan Ahmed", role: "Admin", action: "User authenticated on desktop system", ipAddress: "192.168.1.50", browser: "Chrome 124.0.0", timestamp: "2026-07-07T08:00:00Z" },
    { id: "LOG-002", user: "Ali Raza", role: "User", action: "Recorded morning milk collection from Supplier SUPP-001", ipAddress: "192.168.1.51", browser: "Firefox 125.0", timestamp: "2026-07-07T08:15:00Z" },
    { id: "LOG-003", user: "Subhan Ahmed", role: "Admin", action: "Updated pricing for Sweet Thick Yogurt (Kunda) to 240/kg", ipAddress: "192.168.1.50", browser: "Chrome 124.0.0", timestamp: "2026-07-07T09:30:00Z" },
    { id: "LOG-004", user: "Ali Raza", role: "User", action: "Created Invoice #SUB-INV-10201 for Gourmet Sweets", ipAddress: "192.168.1.51", browser: "Firefox 125.0", timestamp: "2026-07-07T11:45:00Z" },
    { id: "LOG-005", user: "Subhan Ahmed", role: "Admin", action: "Approved salary disbursement of PKR 55,000 to Ali Raza", ipAddress: "192.168.1.50", browser: "Chrome 124.0.0", timestamp: "2026-07-06T18:00:00Z" }
  ]);

  // 11. Notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "NOT-001", title: "Low Stock Alert: Desi White Butter", message: "White butter stock has dropped below minimum threshold limit. Current: 42 Kg (Min: 15 Kg but demands rising).", type: "warning", read: false, date: "2026-07-07T12:00:00Z" },
    { id: "NOT-002", title: "Overdue Customer: Gourmet Bakery", message: "Gourmet Sweets has crossed the credit alert mark with 125,000 PKR outstanding. Send payment reminder.", type: "danger", read: false, date: "2026-07-07T10:30:00Z" },
    { id: "NOT-003", title: "Supplier Payment Pending", message: "Weekly payment calculation is pending for Malik Mumtaz Dairy Farm (280,000 PKR outstanding).", type: "info", read: false, date: "2026-07-07T09:00:00Z" },
    { id: "NOT-004", title: "Backup Reminder", message: "Local system has not been synced to Cloud Secure Server since yesterday. Backup database now.", type: "warning", read: false, date: "2026-07-06T23:59:00Z" }
  ]);

  // Seeding initial Payments list based on other states to make metrics realistic
  useEffect(() => {
    const defaultPayments: PaymentRecord[] = [
      { id: "PAY-001", type: "Customer Payment", partyId: "CUST-002", partyName: "Gourmet Bakery & Sweets", amount: 40000, date: "2026-07-07", paymentMethod: PaymentMethod.CASH, referenceNo: "REF-9921", remainingBalance: 125000 },
      { id: "PAY-002", type: "Customer Payment", partyId: "CUST-004", partyName: "Al-Hamdu Tea Stall", amount: 7000, date: "2026-07-07", paymentMethod: PaymentMethod.EASYPAISA, referenceNo: "EP-4421", remainingBalance: -15000 },
      { id: "PAY-003", type: "Supplier Payment", partyId: "SUPP-003", partyName: "Sardar Muhammad Khan", amount: 35880, date: "2026-07-07", paymentMethod: PaymentMethod.BANK, referenceNo: "MEZ-0921", remainingBalance: 85000 },
      { id: "PAY-004", type: "Expense", partyId: "Electricity", partyName: "LESCO Lahore Electricity", amount: 48500, date: "2026-07-02", paymentMethod: PaymentMethod.BANK, referenceNo: "HBL-222", remainingBalance: 0 },
      { id: "PAY-005", type: "Salary", partyId: "EMP-001", partyName: "Ali Raza (Manager Salary)", amount: 55000, date: "2026-07-01", paymentMethod: PaymentMethod.CASH, referenceNo: "CASH-SAL-01", remainingBalance: 0 }
    ];
    setPayments(defaultPayments);
  }, []);

  // --- TRANS Translation Utility ---
  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || key;
    }
    // Return key as visual display if not found, but we cover extensively
    return key;
  };

  // Locale Formatting Utilities
  const formatCurrency = (amount: number): string => {
    if (language === "ur") {
      return `${amount.toLocaleString("en-US")} روپے`;
    }
    return `₨ ${amount.toLocaleString("en-US")}`;
  };

  const formatNumber = (num: number, decimals: number = 0): string => {
    return num.toLocaleString(language === "ur" ? "en-US" : "en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(language === "ur" ? "ur-PK" : "en-US", options);
  };

  // Helper to append log
  const addAuditLog = (userOverride?: string, actionMessage?: string) => {
    const operator = userOverride || (role === "Admin" ? "Subhan Ahmed" : "Ali Raza");
    const newLog: AuditLog = {
      id: `LOG-${Math.floor(Math.random() * 900000) + 100000}`,
      user: operator,
      role: role,
      action: actionMessage || "Performed an action in the system",
      ipAddress: "192.168.1.102",
      browser: "Chrome (AI Preview Console)",
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // --- DATABASE MUTATIONS ---

  // Customers Actions
  const addCustomer = (cust: Omit<Customer, "id" | "remainingBalance" | "monthlyBillEstimate">) => {
    const newId = `CUST-${Math.floor(Math.random() * 900) + 100}`;
    const estimate = (cust.dailyQtyMorning + cust.dailyQtyEvening) * cust.rate * 30;
    const newCust: Customer = {
      ...cust,
      id: newId,
      remainingBalance: cust.advancePayment > 0 ? -cust.advancePayment : 0,
      monthlyBillEstimate: estimate
    };
    setCustomers(prev => [newCust, ...prev]);
    addAuditLog(undefined, `Added Customer: ${cust.name} (Qty Morning: ${cust.dailyQtyMorning}L, Rate: Rs. ${cust.rate})`);
    
    // Add success notification
    setNotifications(prev => [
      {
        id: `NOT-${Math.random()}`,
        title: "New Customer Registered",
        message: `${cust.name} added successfully with estimate billing of Rs. ${estimate}/month.`,
        type: "success",
        read: false,
        date: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const updateCustomer = (id: string, updatedFields: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const merged = { ...c, ...updatedFields };
        merged.monthlyBillEstimate = (merged.dailyQtyMorning + merged.dailyQtyEvening) * merged.rate * 30;
        return merged;
      }
      return c;
    }));
    const original = customers.find(c => c.id === id);
    addAuditLog(undefined, `Updated Customer: ${original?.name || id}`);
  };

  const deleteCustomer = (id: string) => {
    const original = customers.find(c => c.id === id);
    setCustomers(prev => prev.filter(c => c.id !== id));
    addAuditLog(undefined, `Deleted Customer record: ${original?.name || id}`);
  };

  // Suppliers Actions
  const addSupplier = (supp: Omit<Supplier, "id" | "outstandingBalance">) => {
    const newId = `SUPP-${Math.floor(Math.random() * 900) + 100}`;
    const newSupp: Supplier = {
      ...supp,
      id: newId,
      outstandingBalance: 0
    };
    setSuppliers(prev => [newSupp, ...prev]);
    addAuditLog(undefined, `Added Supplier: ${supp.name} from village ${supp.village}`);
  };

  const updateSupplier = (id: string, updatedFields: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
    const original = suppliers.find(s => s.id === id);
    addAuditLog(undefined, `Updated Supplier: ${original?.name || id}`);
  };

  const deleteSupplier = (id: string) => {
    const original = suppliers.find(s => s.id === id);
    setSuppliers(prev => prev.filter(s => s.id !== id));
    addAuditLog(undefined, `Deleted Supplier: ${original?.name || id}`);
  };

  // Milk Collection
  const addCollection = (col: Omit<MilkCollection, "id" | "totalAmount" | "rate" | "date" | "receiverName">) => {
    const newId = `COL-${Math.floor(Math.random() * 900000) + 100000}`;
    const supplier = suppliers.find(s => s.id === col.supplierId);
    
    // Auto-calculate rate and total based on FAT % & SNF %
    // Pakistani industry standard formula: Base rate * (FAT + SNF) / Standard_FAT_SNF_Sum
    const baseRate = supplier ? supplier.rate : 150;
    const rateCalculated = Math.round(baseRate * (col.fat + col.snf) / (6.0 + 8.5));
    const total = Math.round(rateCalculated * col.quantity);

    const newCol: MilkCollection = {
      ...col,
      id: newId,
      date: new Date().toISOString().split("T")[0],
      rate: rateCalculated,
      totalAmount: total,
      receiverName: role === "Admin" ? "Subhan Ahmed" : "Ali Raza",
      paymentStatus: "Pending"
    };

    setCollections(prev => [newCol, ...prev]);

    // Update supplier outstanding balance automatically
    setSuppliers(prev => prev.map(s => {
      if (s.id === col.supplierId) {
        return { ...s, outstandingBalance: s.outstandingBalance + total };
      }
      return s;
    }));

    // Update Inventory stock of Milk Category
    setInventory(prev => prev.map(item => {
      if (item.category === "Milk" && item.name.includes(col.milkType === MilkType.COW ? "Cow" : "Buffalo")) {
        return {
          ...item,
          currentStock: item.currentStock + col.quantity,
          stockIn: item.stockIn + col.quantity
        };
      }
      return item;
    }));

    addAuditLog(undefined, `Recorded Milk Collection: ${col.quantity}L ${col.milkType} from ${col.supplierName}. Total calculated: Rs. ${total}`);
  };

  const deleteCollection = (id: string) => {
    const original = collections.find(c => c.id === id);
    if (original) {
      // Deduct outstanding balance from supplier
      setSuppliers(prev => prev.map(s => {
        if (s.id === original.supplierId) {
          return { ...s, outstandingBalance: Math.max(0, s.outstandingBalance - original.totalAmount) };
        }
        return s;
      }));

      // Deduct inventory
      setInventory(prev => prev.map(item => {
        if (item.category === "Milk" && item.name.includes(original.milkType === MilkType.COW ? "Cow" : "Buffalo")) {
          return {
            ...item,
            currentStock: Math.max(0, item.currentStock - original.quantity),
            stockIn: Math.max(0, item.stockIn - original.quantity)
          };
        }
        return item;
      }));
    }
    setCollections(prev => prev.filter(c => c.id !== id));
    addAuditLog(undefined, `Deleted collection log reference: ${id}`);
  };

  // Inventory Stock Mutations
  const updateInventoryStock = (id: string, currentStock: number, damagedStock = 0, returnedStock = 0) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const itemCopy = { ...item, currentStock, damagedStock: item.damagedStock + damagedStock, returnedStock: item.returnedStock + returnedStock };
        // Check low stock alert
        if (currentStock <= item.minStock) {
          setNotifications(prevNot => {
            // Avoid duplicate notifications
            if (prevNot.some(n => n.title.includes(item.name))) return prevNot;
            return [
              {
                id: `NOT-${Math.random()}`,
                title: `Low Stock Critical: ${item.name}`,
                message: `The product stock is currently at ${currentStock} ${item.unit}. Minimum required threshold is ${item.minStock}.`,
                type: "danger",
                read: false,
                date: new Date().toISOString()
              },
              ...prevNot
            ];
          });
        }
        return itemCopy;
      }
      return item;
    }));
    const original = inventory.find(i => i.id === id);
    addAuditLog(undefined, `Updated stock for ${original?.name}: New Stock ${currentStock} ${original?.unit}`);
  };

  const addInventoryItem = (item: Omit<InventoryItem, "id" | "stockIn" | "stockOut" | "damagedStock" | "returnedStock">) => {
    const newId = `INV-${Math.floor(Math.random() * 900) + 100}`;
    const newItem: InventoryItem = {
      ...item,
      id: newId,
      stockIn: item.currentStock,
      stockOut: 0,
      damagedStock: 0,
      returnedStock: 0
    };
    setInventory(prev => [...prev, newItem]);
    addAuditLog(undefined, `Added Product to Inventory: ${item.name} (${item.currentStock} ${item.unit})`);
  };

  // Invoices & Billing
  const addInvoice = (inv: Omit<Invoice, "id" | "invoiceNumber" | "date" | "total" | "remaining" | "customerName">) => {
    const invoiceId = `INV-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${Math.floor(Math.random() * 900) + 100}`;
    const invNo = `SUB-INV-${Math.floor(Math.random() * 90000) + 10000}`;
    
    const customer = customers.find(c => c.id === inv.customerId);
    const customerName = customer ? customer.name : "Walk-in Customer";

    // Calculate total product amounts
    let productsSum = 0;
    inv.products.forEach(p => {
      productsSum += p.amount;
    });

    const netTotal = productsSum - inv.discount + inv.tax + inv.extraCharges;
    const remaining = netTotal - inv.paid;

    const newInv: Invoice = {
      ...inv,
      id: invoiceId,
      invoiceNumber: invNo,
      customerName,
      date: new Date().toISOString().split("T")[0],
      total: netTotal,
      remaining: remaining,
      status: remaining <= 0 ? "Paid" : inv.paid > 0 ? "Partially Paid" : "Unpaid"
    };

    setInvoices(prev => [newInv, ...prev]);

    // Update customer ledger / balance
    if (inv.customerId && customer) {
      setCustomers(prev => prev.map(c => {
        if (c.id === inv.customerId) {
          // If customer has remaining balance
          const updatedBalance = c.remainingBalance + remaining;
          return {
            ...c,
            remainingBalance: updatedBalance,
            lastPaymentDate: inv.paid > 0 ? new Date().toISOString().split("T")[0] : c.lastPaymentDate
          };
        }
        return c;
      }));
    }

    // Deduct stock for all purchased items
    inv.products.forEach(product => {
      setInventory(prev => prev.map(item => {
        if (item.id === product.productId) {
          const newStock = Math.max(0, item.currentStock - product.quantity);
          return {
            ...item,
            currentStock: newStock,
            stockOut: item.stockOut + product.quantity
          };
        }
        return item;
      }));
    });

    // Save payment log if customer paid something
    if (inv.paid > 0) {
      const payId = `PAY-${Math.floor(Math.random() * 90000) + 10000}`;
      const newPay: PaymentRecord = {
        id: payId,
        type: "Customer Payment",
        partyId: inv.customerId,
        partyName: customerName,
        amount: inv.paid,
        date: new Date().toISOString().split("T")[0],
        paymentMethod: inv.paymentMethod,
        referenceNo: `INV-REF-${invNo}`,
        remainingBalance: customer ? (customer.remainingBalance + remaining - inv.paid) : 0
      };
      setPayments(prev => [newPay, ...prev]);
    }

    addAuditLog(undefined, `Created Invoice ${invNo} for ${customerName}. Total Bill: Rs. ${netTotal}, Paid: Rs. ${inv.paid}`);
  };

  const cancelInvoice = (id: string) => {
    const original = invoices.find(inv => inv.id === id);
    if (!original || original.status === "Cancelled") return;

    // Mark invoice as cancelled
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: "Cancelled" } : inv));

    // Revert customer balance if it was linked
    if (original.customerId) {
      setCustomers(prev => prev.map(c => {
        if (c.id === original.customerId) {
          return { ...c, remainingBalance: Math.max(0, c.remainingBalance - original.remaining) };
        }
        return c;
      }));
    }

    // Revert inventory stocks
    original.products.forEach(p => {
      setInventory(prev => prev.map(item => {
        if (item.id === p.productId) {
          return {
            ...item,
            currentStock: item.currentStock + p.quantity,
            stockOut: Math.max(0, item.stockOut - p.quantity)
          };
        }
        return item;
      }));
    });

    addAuditLog(undefined, `Cancelled Invoice ${original.invoiceNumber}. Restored inventory stocks.`);
  };

  // Expense Actions
  const addExpense = (exp: Omit<Expense, "id" | "date">) => {
    const newId = `EXP-${Math.floor(Math.random() * 900) + 100}`;
    const newExp: Expense = {
      ...exp,
      id: newId,
      date: new Date().toISOString().split("T")[0]
    };
    setExpenses(prev => [newExp, ...prev]);

    // Save into Payments Ledger
    const payId = `PAY-${Math.floor(Math.random() * 90000) + 10000}`;
    const newPay: PaymentRecord = {
      id: payId,
      type: "Expense",
      partyId: exp.category,
      partyName: `${exp.category} Expense (${exp.paidTo || "General"})`,
      amount: exp.amount,
      date: new Date().toISOString().split("T")[0],
      paymentMethod: exp.paymentMethod,
      remainingBalance: 0
    };
    setPayments(prev => [newPay, ...prev]);

    addAuditLog(undefined, `Recorded Expense of Rs. ${exp.amount} for ${exp.category}`);
  };

  // Staff Actions
  const addEmployee = (emp: Omit<Employee, "id" | "attendanceToday" | "leavesTaken" | "performanceScore">) => {
    const newId = `EMP-${Math.floor(Math.random() * 90) + 10}`;
    const newEmp: Employee = {
      ...emp,
      id: newId,
      attendanceToday: "Not Marked",
      leavesTaken: 0,
      performanceScore: 5.0
    };
    setEmployees(prev => [...prev, newEmp]);
    addAuditLog(undefined, `Registered New Employee: ${emp.name} (Role: ${emp.role}, Salary: Rs. ${emp.salary})`);
  };

  const toggleAttendance = (id: string, status: "Present" | "Absent" | "Leave" | "Late") => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        let lCount = emp.leavesTaken;
        if (status === "Leave" && emp.attendanceToday !== "Leave") {
          lCount += 1;
        } else if (status !== "Leave" && emp.attendanceToday === "Leave") {
          lCount = Math.max(0, lCount - 1);
        }
        return {
          ...emp,
          attendanceToday: status,
          leavesTaken: lCount
        };
      }
      return emp;
    }));
    const employee = employees.find(e => e.id === id);
    addAuditLog(undefined, `Marked Attendance for ${employee?.name}: ${status}`);
  };

  const deleteEmployee = (id: string) => {
    const original = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    addAuditLog(undefined, `Removed employee profile: ${original?.name || id}`);
  };

  // Payment Record
  const addPayment = (pay: Omit<PaymentRecord, "id" | "date" | "remainingBalance">) => {
    const payId = `PAY-${Math.floor(Math.random() * 90000) + 10000}`;
    let remainingBal = 0;

    if (pay.type === "Customer Payment") {
      setCustomers(prev => prev.map(c => {
        if (c.id === pay.partyId) {
          const updatedBal = c.remainingBalance - pay.amount;
          remainingBal = updatedBal;
          return {
            ...c,
            remainingBalance: updatedBal,
            lastPaymentDate: new Date().toISOString().split("T")[0]
          };
        }
        return c;
      }));
    } else if (pay.type === "Supplier Payment") {
      setSuppliers(prev => prev.map(s => {
        if (s.id === pay.partyId) {
          const updatedBal = s.outstandingBalance - pay.amount;
          remainingBal = updatedBal;
          return {
            ...s,
            outstandingBalance: updatedBal
          };
        }
        return s;
      }));
    }

    const newPay: PaymentRecord = {
      ...pay,
      id: payId,
      date: new Date().toISOString().split("T")[0],
      remainingBalance: remainingBal
    };

    setPayments(prev => [newPay, ...prev]);
    addAuditLog(undefined, `Recorded ${pay.type} for ${pay.partyName}. Amount: Rs. ${pay.amount}`);
  };

  // Notifications
  const clearNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        direction,
        theme,
        setTheme,
        role,
        setRole,
        currentUser,
        
        customers,
        suppliers,
        collections,
        inventory,
        invoices,
        expenses,
        employees,
        routes,
        payments,
        auditLogs,
        notifications,
        
        t,
        formatCurrency,
        formatNumber,
        formatDate,
        
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addCollection,
        deleteCollection,
        updateInventoryStock,
        addInventoryItem,
        addInvoice,
        cancelInvoice,
        addExpense,
        addEmployee,
        toggleAttendance,
        deleteEmployee,
        addPayment,
        clearNotification,
        clearAllNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
