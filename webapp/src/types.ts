/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CustomerType {
  RESIDENTIAL = "Residential",
  HOTEL = "Hotel",
  TEA_STALL = "Tea Stall",
  RESTAURANT = "Restaurant",
  BAKERY = "Bakery",
  SHOP = "Shop",
  COLLECTION_POINT = "Milk Collection Point"
}

export enum PaymentMethod {
  CASH = "Cash",
  BANK = "Bank Transfer",
  JAZZCASH = "JazzCash",
  EASYPAISA = "EasyPaisa",
  CREDIT = "Credit / Khata"
}

export enum MilkType {
  COW = "Cow Milk",
  BUFFALO = "Buffalo Milk",
  MIXED = "Mixed Milk"
}

export enum Shift {
  MORNING = "Morning",
  EVENING = "Evening"
}

export interface Customer {
  id: string;
  name: string;
  fatherName: string;
  phone: string;
  altPhone?: string;
  address: string;
  area: string;
  city: string;
  cnic: string;
  type: CustomerType;
  dailyQtyMorning: number; // in litres
  dailyQtyEvening: number; // in litres
  rate: number; // rate per litre
  monthlyBillEstimate: number;
  remainingBalance: number; // positive is receivable, negative is advance
  advancePayment: number;
  creditLimit: number;
  lastPaymentDate?: string;
  deliveryAddress: string;
  deliveryRouteId: string;
  status: "Active" | "Inactive";
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  village: string;
  milkSource: MilkType;
  morningSupply: number; // average litres
  eveningSupply: number; // average litres
  milkFat: number; // average Fat %
  snf: number; // average SNF %
  rate: number; // rate per litre
  purchaseQtyLimit?: number;
  outstandingBalance: number; // what shop owes to supplier
  bankDetails?: {
    bankName: string;
    accountTitle: string;
    iban: string;
  };
  status: "Active" | "Inactive";
}

export interface MilkCollection {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  shift: Shift;
  milkType: MilkType;
  quantity: number; // litres
  fat: number; // Fat %
  snf: number; // SNF %
  rate: number; // price per litre based on fat/snf
  totalAmount: number;
  remarks: string;
  temperature: number; // in Celsius
  vehicleNo?: string;
  receiverName: string;
  paymentStatus?: "Paid" | "Pending";
}

export interface InventoryItem {
  id: string;
  category: "Milk" | "Yogurt" | "Butter" | "Cream" | "Desi Ghee" | "Lassi" | "Packaging" | "Cleaning" | "Other";
  name: string;
  currentStock: number;
  unit: string; // Litre, Kg, Unit, Box
  minStock: number; // threshold for low stock alert
  expiryDate?: string;
  batchNumber?: string;
  stockIn: number;
  stockOut: number;
  damagedStock: number;
  returnedStock: number;
  pricePerUnit: number;
}

export interface Expense {
  id: string;
  category?: string;
  amount: number;
  date: string;
  paid: boolean;
  paidTo?: string;
  paymentMethod: string;
  notes?: string;
  description?: string;
  approvedBy?: string;
  referenceNo?: string;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  role: "Manager" | "Salesperson" | "Delivery Boy" | "Quality Tester" | "Helper";
  salary: number;
  attendanceToday: "Present" | "Absent" | "Leave" | "Late" | "Not Marked";
  leavesTaken: number;
  performanceScore: number; // 1 to 5 stars
  permissions: string[];
}

export interface DeliveryRoute {
  id: string;
  routeName: string;
  driverName: string;
  deliveryBoyName: string;
  vehicleNo: string;
  totalDeliveries: number;
  completedDeliveries: number;
  status: "Active" | "Completed" | "Pending";
}

export interface PaymentRecord {
  id: string;
  type: "Customer Payment" | "Supplier Payment" | "Expense" | "Salary" | "Advance";
  partyId: string; // Customer ID, Supplier ID, Employee ID or Expense Category
  partyName: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod | string;
  referenceNo?: string;
  remainingBalance: number;
}

export interface AuditLog {
  id: string;
  user: string;
  role: "Admin" | "User";
  action: string; // e.g., "Updated Customer: Muhammad Ali", "Deleted Invoice #INV-102"
  ipAddress: string;
  browser: string;
  timestamp: string;
}

export interface UserAccount {
  username: string;
  displayName: string;
  role: "Admin" | "User";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "danger";
  read: boolean;
  date: string;
}

export interface DeliveryCustomer {
  id: string;
  name: string;
  phone: string;
  altPhone?: string;
  colony?: string;
  street?: string;
  sector?: string;
  houseNo?: string;
  addressLine?: string;
  milkQuantity: number;
  deliveryTime: string;
  monthlyRate: number;
  billType: "per_litre" | "fixed_monthly";
  monthlyFee: number;
  pendingBalance: number;
  notes?: string;
  status: "Active" | "Inactive";
  createdAt?: string;
}

export interface DeliveryRecord {
  id: string;
  customerId: string;
  date: string;
  delivered: boolean;
  quantity: number;
  notes?: string;
}

export interface DeliveryPayment {
  id: string;
  customerId: string;
  amount: number;
  month: string;
  paymentMethod: string;
  paymentDate: string;
  notes?: string;
}
