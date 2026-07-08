/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    ur: string;
  };
}

export const translations: TranslationDictionary = {
  appName: {
    en: "SUBHANALLAH Milk Shop",
    ur: "سبحان اللہ ملک شاپ"
  },
  appSubtitle: {
    en: "Management ERP System",
    ur: "مینجمنٹ ای آر پی سسٹم"
  },
  searchPlaceholder: {
    en: "Search customer, invoice, supplier, phone...",
    ur: "گاہک، انوائس، سپلائر یا فون سرچ کریں..."
  },
  admin: {
    en: "Admin",
    ur: "ایڈمن"
  },
  user: {
    en: "User / Staff",
    ur: "صارف / عملہ"
  },
  roleSwitch: {
    en: "Switch Role",
    ur: "کردار تبدیل کریں"
  },
  logout: {
    en: "Logout",
    ur: "لاگ آؤٹ"
  },
  language: {
    en: "Language",
    ur: "زبان"
  },
  theme: {
    en: "Theme",
    ur: "تھیم"
  },
  light: {
    en: "Light",
    ur: "روشن"
  },
  dark: {
    en: "Dark",
    ur: "تاریک"
  },
  
  // Sidebar Items
  dashboard: {
    en: "Dashboard",
    ur: "ڈیش بورڈ"
  },
  customers: {
    en: "Customers",
    ur: "گاہک (کھاتہ)"
  },
  suppliers: {
    en: "Suppliers",
    ur: "سپلائرز"
  },
  milkCollection: {
    en: "Milk Collection",
    ur: "دودھ جمع آوری"
  },
  inventory: {
    en: "Inventory",
    ur: "اسٹاک / انوینٹری"
  },
  sales: {
    en: "Sales & Billing",
    ur: "فروخت اور بلنگ"
  },
  expenses: {
    en: "Expenses",
    ur: "اخراجات"
  },
  staff: {
    en: "Staff Management",
    ur: "عملے کا انتظام"
  },
  delivery: {
    en: "Delivery Routes",
    ur: "ڈیلیوری روٹس"
  },
  payments: {
    en: "Payments Ledger",
    ur: "ادائیگیاں"
  },
  reports: {
    en: "Reports & Excel",
    ur: "رپورٹس"
  },
  auditLog: {
    en: "Audit Logs",
    ur: "آڈٹ لاگز"
  },
  settings: {
    en: "Settings",
    ur: "ترتیبات"
  },

  // KPI Metrics
  todaySales: {
    en: "Today's Sales",
    ur: "آج کی فروخت"
  },
  todayCollection: {
    en: "Today's Collection",
    ur: "آج کا جمع شدہ دودھ"
  },
  todayCredit: {
    en: "Today's Credit (Khata)",
    ur: "آج کا ادھار"
  },
  monthlySales: {
    en: "Monthly Sales",
    ur: "ماہانہ فروخت"
  },
  monthlyProfit: {
    en: "Monthly Profit (Est.)",
    ur: "ماہانہ منافع"
  },
  monthlyPurchases: {
    en: "Monthly Purchases",
    ur: "ماہانہ خریداری"
  },
  lowStockAlert: {
    en: "Low Stock Items",
    ur: "کم اسٹاک آئٹمز"
  },
  pendingPayments: {
    en: "Pending Customer Bills",
    ur: "واجب الادا گاہک بل"
  },
  supplierBalanceTotal: {
    en: "Payable to Suppliers",
    ur: "سپلائرز کو واجب الادا"
  },
  customerBalanceTotal: {
    en: "Receivable Customer Balances",
    ur: "گاہکوں سے وصولی رقم"
  },
  remainingStock: {
    en: "Remaining Milk Stock",
    ur: "باقی بچا ہوا دودھ"
  },
  topCustomer: {
    en: "Top Customer Today",
    ur: "آج کا بہترین گاہک"
  },
  topSupplier: {
    en: "Top Supplier Today",
    ur: "آج کا بہترین سپلائر"
  },
  milkPurchasedToday: {
    en: "Milk Collected Today",
    ur: "آج کا حاصل شدہ دودھ"
  },
  milkSoldToday: {
    en: "Milk Sold Today",
    ur: "آج کا فروخت شدہ دودھ"
  },

  // Customer Management
  customerList: {
    en: "Customer List",
    ur: "گاہکوں کی فہرست"
  },
  customerDetails: {
    en: "Customer Ledger Detail",
    ur: "گاہک لیجر تفصیل"
  },
  customerProfile: {
    en: "Profile",
    ur: "پروفائل"
  },
  addCustomer: {
    en: "Add Customer",
    ur: "نیا گاہک شامل کریں"
  },
  customerName: {
    en: "Customer Name",
    ur: "گاہک کا نام"
  },
  fatherName: {
    en: "Father's Name",
    ur: "والد کا نام"
  },
  phone: {
    en: "Phone Number",
    ur: "فون نمبر"
  },
  altPhone: {
    en: "Alternative Phone",
    ur: "متبادل فون"
  },
  cnic: {
    en: "CNIC Number",
    ur: "شناختی کارڈ نمبر"
  },
  address: {
    en: "Address",
    ur: "پتہ"
  },
  area: {
    en: "Area / Mohallah",
    ur: "علاقہ / محلہ"
  },
  city: {
    en: "City",
    ur: "شہر"
  },
  customerType: {
    en: "Customer Type",
    ur: "گاہک کی قسم"
  },
  dailyQtyMorning: {
    en: "Morning Quantity (Ltr)",
    ur: "صبح کی مقدار (لیٹر)"
  },
  dailyQtyEvening: {
    en: "Evening Quantity (Ltr)",
    ur: "شام کی مقدار (لیٹر)"
  },
  ratePerLitre: {
    en: "Rate per Litre (PKR)",
    ur: "فی لیٹر ریٹ (روپے)"
  },
  creditLimit: {
    en: "Credit Limit (PKR)",
    ur: "ادھار کی حد (روپے)"
  },
  balance: {
    en: "Current Balance",
    ur: "موجودہ بیلنس"
  },
  advance: {
    en: "Advance Payment",
    ur: "ایڈوانس ادائیگی"
  },
  status: {
    en: "Status",
    ur: "حیثیت (اسٹیٹس)"
  },
  active: {
    en: "Active",
    ur: "فعال"
  },
  inactive: {
    en: "Inactive",
    ur: "غیر فعال"
  },
  deliveryRoute: {
    en: "Delivery Route",
    ur: "ڈیلیوری روٹ"
  },
  notes: {
    en: "Notes / Details",
    ur: "خصوصی نوٹ"
  },

  // Supplier Management
  supplierList: {
    en: "Supplier List",
    ur: "سپلائرز کی فہرست"
  },
  addSupplier: {
    en: "Add Supplier",
    ur: "نیا سپلائر شامل کریں"
  },
  supplierName: {
    en: "Supplier Name",
    ur: "سپلائر کا نام"
  },
  village: {
    en: "Village / Town",
    ur: "گاؤں / قصبہ"
  },
  milkSource: {
    en: "Milk Source Type",
    ur: "دودھ کا ذریعہ"
  },
  morningSupply: {
    en: "Morning Supply (Ltr)",
    ur: "صبح کی سپلائی (لیٹر)"
  },
  eveningSupply: {
    en: "Evening Supply (Ltr)",
    ur: "شام کی سپلائی (لیٹر)"
  },
  fatPct: {
    en: "Fat %",
    ur: "چربی (فیٹ) ٪"
  },
  snfPct: {
    en: "SNF %",
    ur: "ایس این ایف ٪"
  },
  outstandingBalance: {
    en: "Outstanding Balance (PKR)",
    ur: "سپلائر کا بقایا بیلنس"
  },
  bankName: {
    en: "Bank Name",
    ur: "بینک کا نام"
  },
  accountTitle: {
    en: "Account Title",
    ur: "اکاؤنٹ ٹائٹل"
  },
  iban: {
    en: "IBAN",
    ur: "آئی بان نمبر"
  },

  // Milk Collection
  newCollection: {
    en: "Record Milk Collection",
    ur: "دودھ وصولی درج کریں"
  },
  shift: {
    en: "Shift",
    ur: "شفٹ"
  },
  morning: {
    en: "Morning",
    ur: "صبح"
  },
  evening: {
    en: "Evening",
    ur: "شام"
  },
  temperature: {
    en: "Temperature (°C)",
    ur: "درجہ حرارت (°C)"
  },
  vehicleNo: {
    en: "Vehicle / Container No.",
    ur: "گاڑی نمبر"
  },
  receiverName: {
    en: "Receiver Name",
    ur: "وصول کنندہ"
  },
  qualityRemarks: {
    en: "Quality Remarks",
    ur: "معیاری ریمارکس"
  },

  // Inventory
  addStock: {
    en: "Add Product",
    ur: "نئی پروڈکٹ شامل کریں"
  },
  category: {
    en: "Category",
    ur: "کیٹیگری"
  },
  currentStockLabel: {
    en: "Current Stock",
    ur: "موجودہ اسٹاک"
  },
  minStockLabel: {
    en: "Min. Threshold",
    ur: "کم از کم اسٹاک حد"
  },
  expiryDate: {
    en: "Expiry Date",
    ur: "تاریخِ تنسیخ"
  },
  damagedStockLabel: {
    en: "Damaged / Spoiled",
    ur: "خراب شدہ اسٹاک"
  },
  returnedStockLabel: {
    en: "Returned Stock",
    ur: "واپس شدہ اسٹاک"
  },
  pricePerUnit: {
    en: "Price per Unit",
    ur: "فی یونٹ قیمت"
  },

  // Sales & Billing
  billingInterface: {
    en: "Subhanallah Billing Terminal",
    ur: "سبحان اللہ بلنگ ٹرمینل"
  },
  newInvoice: {
    en: "Create Invoice",
    ur: "نیا بل بنائیں"
  },
  invoiceNo: {
    en: "Invoice No.",
    ur: "انوائس نمبر"
  },
  selectCustomer: {
    en: "Select Customer",
    ur: "گاہک منتخب کریں"
  },
  addProduct: {
    en: "Add Product",
    ur: "مصنوعات شامل کریں"
  },
  productName: {
    en: "Product",
    ur: "پروڈکٹ"
  },
  quantity: {
    en: "Qty",
    ur: "مقدار"
  },
  subTotal: {
    en: "Subtotal",
    ur: "کل رقم"
  },
  discount: {
    en: "Discount (PKR)",
    ur: "رعایت (ڈسکاؤنٹ)"
  },
  tax: {
    en: "Taxes / Sales Tax",
    ur: "ٹیکس / سیلز ٹیکس"
  },
  extraCharges: {
    en: "Extra Charges (Delivery)",
    ur: "اضافی چارجز"
  },
  netTotal: {
    en: "Net Total (PKR)",
    ur: "کل واجب الادا رقم"
  },
  paidAmount: {
    en: "Paid Amount (PKR)",
    ur: "ادا شدہ رقم"
  },
  remainingAmount: {
    en: "Remaining / Ledger Balance",
    ur: "باقی واجب الادا رقم"
  },
  paymentMethodLabel: {
    en: "Payment Method",
    ur: "ادائیگی کا طریقہ"
  },
  invoiceStatus: {
    en: "Invoice Status",
    ur: "بل کی حیثت"
  },
  printInvoice: {
    en: "Print Invoice Receipt",
    ur: "رسید پرنٹ کریں"
  },
  pdfReceipt: {
    en: "Generate PDF Preview",
    ur: "پی ڈی ایف رسید"
  },

  // Expenses
  addExpense: {
    en: "Record Expense",
    ur: "خرچہ درج کریں"
  },
  expenseCategory: {
    en: "Expense Type",
    ur: "خرچہ کی قسم"
  },
  amount: {
    en: "Amount (PKR)",
    ur: "رقم (روپے)"
  },
  paidTo: {
    en: "Paid To Name",
    ur: "وصول کنندہ کا نام"
  },

  // Staff & Delivery
  addEmployee: {
    en: "Add Employee",
    ur: "ملازم شامل کریں"
  },
  salary: {
    en: "Monthly Salary (PKR)",
    ur: "ماہانہ تنخواہ"
  },
  attendance: {
    en: "Today's Attendance",
    ur: "آج کی حاضری"
  },
  performance: {
    en: "Performance Rating",
    ur: "کارکردگی کی درجہ بندی"
  },
  routeName: {
    en: "Route Name / Area",
    ur: "روٹ کا نام / علاقہ"
  },
  driverName: {
    en: "Driver",
    ur: "ڈرائیور"
  },
  deliveryBoy: {
    en: "Delivery Boy",
    ur: "ڈیلیوری بوائے"
  },
  completedDeliveries: {
    en: "Deliveries status",
    ur: "ڈیلیوری صورتحال"
  },

  // Reports
  exportExcel: {
    en: "Export Excel Sheet",
    ur: "ایکسل میں ایکسپورٹ کریں"
  },
  exportPdf: {
    en: "Export PDF Document",
    ur: "پی ڈی ایف بنائیں"
  },
  exportCsv: {
    en: "Export CSV",
    ur: "سی ایس وی ڈاؤن لوڈ کریں"
  },
  printReport: {
    en: "Print Report",
    ur: "رپورٹ پرنٹ کریں"
  },
  dailyReport: {
    en: "Daily Sales & Collection Report",
    ur: "روزانہ کی سیلز اور جمع آوری رپورٹ"
  },
  monthlyReport: {
    en: "Monthly Financial Ledger",
    ur: "ماہانہ مالیاتی لیجر"
  },
  profitReport: {
    en: "Profit & Loss Account Summary",
    ur: "منافع اور نقصان کا خلاصہ"
  },

  // Common UI words
  actions: {
    en: "Actions",
    ur: "اقدامات"
  },
  edit: {
    en: "Edit",
    ur: "ترمیم کریں"
  },
  delete: {
    en: "Delete",
    ur: "حذف کریں"
  },
  save: {
    en: "Save & Record",
    ur: "محفوظ کریں"
  },
  cancel: {
    en: "Cancel",
    ur: "منسوخ کریں"
  },
  filterBy: {
    en: "Filter By",
    ur: "فلٹر کریں"
  },
  dateRange: {
    en: "Date Range",
    ur: "تاریخ کی حد"
  },
  all: {
    en: "All Records",
    ur: "تمام ریکارڈز"
  },
  successRecord: {
    en: "Recorded successfully!",
    ur: "ریکارڈ کامیابی کے ساتھ محفوظ ہو گیا!"
  },
  submit: {
    en: "Submit",
    ur: "جمع کریں"
  },
  quickActions: {
    en: "Quick Actions",
    ur: "فوری اقدامات"
  },
  backToList: {
    en: "Back to List",
    ur: "فہرست پر واپس جائیں"
  },
  details: {
    en: "Details",
    ur: "تفصیلات"
  },
  history: {
    en: "History Logs",
    ur: "تاریخچہ"
  },
  notifications: {
    en: "Notifications",
    ur: "اطلاعات (نوٹیفیکیشن)"
  },
  recentActivity: {
    en: "Recent Business Activity",
    ur: "حالیہ کاروباری سرگرمیاں"
  },
  auditLogMsg: {
    en: "Audit Trial logs of system actions",
    ur: "سسٹم کے اقدامات کا آڈٹ ٹرائل"
  },

  // Settings
  shopName: {
    en: "Shop Display Name",
    ur: "شاپ کا نام"
  },
  businessHours: {
    en: "Business Hours",
    ur: "کاروباری اوقات"
  },
  whatsappNo: {
    en: "WhatsApp Alert Number",
    ur: "واٹس ایپ الرٹ نمبر"
  },
  smsEnabled: {
    en: "Automated SMS Billing Status",
    ur: "خودکار ایس ایم ایس بلنگ کی حیثیت"
  },
  backupStatus: {
    en: "Cloud Backup Frequency",
    ur: "کلاؤڈ بیک اپ کی فریکوئنسی"
  },
  salesTaxRate: {
    en: "Sales Tax Rate %",
    ur: "سیلز ٹیکس ریٹ ٪"
  },
  // Chart and other UI strings
  Sales: {
    en: "Sales",
    ur: "فروخت"
  },
  "Credit (Khata)": {
    en: "Credit (Khata)",
    ur: "ادھار (کھاتہ)"
  },
  "Inflow Revenue": {
    en: "Inflow Revenue",
    ur: "آمدنی (ان فلو)"
  },
  "Expenses & Purchases": {
    en: "Expenses & Purchases",
    ur: "اخراجات اور خریداری"
  },
  "Cash In": {
    en: "Cash In",
    ur: "رقم آئی (کیش ان)"
  },
  "Cash Out": {
    en: "Cash Out",
    ur: "رقم گئی (کیش آؤٹ)"
  },
  Mon: { en: "Mon", ur: "پیر" },
  Tue: { en: "Tue", ur: "منگل" },
  Wed: { en: "Wed", ur: "بدھ" },
  Thu: { en: "Thu", ur: "جمعرات" },
  Fri: { en: "Fri", ur: "جمعہ" },
  Sat: { en: "Sat", ur: "ہفتہ" },
  Sun: { en: "Sun", ur: "اتوار" },
  Jan: { en: "Jan", ur: "جنوری" },
  Feb: { en: "Feb", ur: "فروری" },
  Mar: { en: "Mar", ur: "مارچ" },
  Apr: { en: "Apr", ur: "اپریل" },
  May: { en: "May", ur: "مئی" },
  Jun: { en: "Jun", ur: "جون" },
  Jul: { en: "Jul", ur: "جولائی" },
  "Buffalo Milk": { en: "Buffalo Milk", ur: "بھینس کا دودھ" },
  Yogurt: { en: "Yogurt", ur: "دہی" },
  "Desi Ghee": { en: "Desi Ghee", ur: "دیسی گھی" },
  "Fresh Cream": { en: "Fresh Cream", ur: "تازہ ملائی" },
  "White Butter": { en: "White Butter", ur: "سفید مکھن" },
  "Cow Milk": { en: "Cow Milk", ur: "گائے کا دودھ" },
  "Mixed Milk": { en: "Mixed Milk", ur: "مکس دودھ" },
  "Morning Quantity (Ltr)": { en: "Morning Quantity (Ltr)", ur: "صبح کی مقدار (لیٹر)" },
  "Evening Quantity (Ltr)": { en: "Evening Quantity (Ltr)", ur: "شام کی مقدار (لیٹر)" },
  "Morning Supply (Ltr)": { en: "Morning Supply (Ltr)", ur: "صبح کی سپلائی (لیٹر)" },
  "Evening Supply (Ltr)": { en: "Evening Supply (Ltr)", ur: "شام کی سپلائی (لیٹر)" },
  "Outstanding Balance (PKR)": { en: "Outstanding Balance (PKR)", ur: "سپلائر کا بقایا بیلنس" },
  "Daily Subscription Intake": { en: "Daily Subscription Intake", ur: "روزانہ سبسکرپشن کی مقدار" },
  "Sector Zone": { en: "Sector Zone", ur: "سیکٹر زون" },
  "Subscriber details": { en: "Subscriber details", ur: "سبسکرائبر کی تفصیلات" },
  "Voucher Reference": { en: "Voucher Reference", ur: "واؤچر حوالہ" },
  "Cost Category": { en: "Cost Category", ur: "خرچے کا زمرہ" },
  "Detailed Description": { en: "Detailed Description", ur: "تفصیلی وضاحت" },
  "Disbursement Date": { en: "Disbursement Date", ur: "ادائیگی کی تاریخ" },
  "Authorized Approver": { en: "Authorized Approver", ur: "مجاز افسر" },
  "Worker Profile Details": { en: "Worker Profile Details", ur: "ملازم کی تفصیلات" },
  "Contact Phone": { en: "Contact Phone", ur: "رابطہ نمبر" },
  "Target Base Salary": { en: "Target Base Salary", ur: "بنیادی تنخواہ" },
  "Duty Attendance": { en: "Duty Attendance", ur: "ڈیوٹی حاضری" },
  "Invoice Code / Bill Date": { en: "Invoice Code / Bill Date", ur: "انوائس کوڈ / تاریخ" },
  "Linked Customer Account": { en: "Linked Customer Account", ur: "گاہک کا کھاتہ" },
  "Items Sold": { en: "Items Sold", ur: "فروخت شدہ اشیاء" },
  "Gross Bill (Taxes)": { en: "Gross Bill (Taxes)", ur: "کل بل مع ٹیکس" },
  "Settled Amt": { en: "Settled Amt", ur: "ادا شدہ رقم" },
  "Current Ledger Status": { en: "Current Ledger Status", ur: "موجودہ لیجر اسٹیٹس" },
  "SKU / Product Particulars": { en: "SKU / Product Particulars", ur: "پروڈکٹ کی تفصیلات" },
  "Unit Price": { en: "Unit Price", ur: "فی یونٹ قیمت" },
  "Threshold Min": { en: "Threshold Min", ur: "کم از کم حد" },
  "Physical Stock In": { en: "Physical Stock In", ur: "اسٹاک آمد (ان)" },
  "Physical Stock Out": { en: "Physical Stock Out", ur: "اسٹاک فروخت (آؤٹ)" },
  "Loss / Damaged": { en: "Loss / Damaged", ur: "نقصان / خراب" },
  "Available Quantity": { en: "Available Quantity", ur: "دستیاب مقدار" },
  "Supplier Name": { en: "Supplier Name", ur: "سپلائر کا نام" },
  "Date & Shift": { en: "Date & Shift", ur: "تاریخ اور شفٹ" },
  "Milk Type": { en: "Milk Type", ur: "دودھ کی قسم" },
  "Intake Qty": { en: "Intake Qty", ur: "حاصل شدہ مقدار" },
  "Fat / SNF %": { en: "Fat / SNF %", ur: "فیٹ / ایس این ایف ٪" },
  "Agreed Rate": { en: "Agreed Rate", ur: "طے شدہ ریٹ" },
  "Gross Val (PKR)": { en: "Gross Val (PKR)", ur: "کل قیمت (روپے)" },
  "Farmer / Dairy Farm": { en: "Farmer / Dairy Farm", ur: "کسان / ڈیری فارم" },
  "Contact": { en: "Contact", ur: "رابطہ نمبر" },
  "Village Origin": { en: "Village Origin", ur: "گاؤں کا نام" },
  "Agreed Fat / SNF": { en: "Agreed Fat / SNF", ur: "طے شدہ فیٹ / ایس این ایف" },
  "Base Procurement Rate": { en: "Base Procurement Rate", ur: "خریداری ریٹ" },
  "Customer Name": { en: "Customer Name", ur: "گاہک کا نام" },
  "Area & Route": { en: "Area & Route", ur: "علاقہ اور روٹ" },
  "Daily Milk Demand": { en: "Daily Milk Demand", ur: "روزانہ دودھ کی طلب" },
  "Agreed Price": { en: "Agreed Price", ur: "طے شدہ قیمت" },
  "Authorized User": { en: "Authorized User", ur: "مجاز صارف" },
  "Staff Role": { en: "Staff Role", ur: "عملے کا کردار" },
  "System Module": { en: "System Module", ur: "سسٹم ماڈیول" },
  "Action Details": { en: "Action Details", ur: "کارروائی کی تفصیلات" },
  "Authorized Area Officer": { en: "Authorized Area Officer", ur: "مجاز افسر" },
  "Total Daily Deliveries": { en: "Total Daily Deliveries", ur: "روزانہ کی کل ڈیلیوریز" },
  "Active / Finished": { en: "Active / Finished", ur: "ڈیلیوری کی صورتحال" },
  "Total Cost Value": { en: "Total Cost Value", ur: "کل لاگت" },
  "Action Type": { en: "Action Type", ur: "کارروائی کی قسم" },
  "Disbursement Status": { en: "Disbursement Status", ur: "ادائیگی کی صورتحال" },
  "Account Group": { en: "Account Group", ur: "کھاتہ گروپ" },
  "Cash Ledger Parameter": { en: "Cash Ledger Parameter", ur: "کیش لیجر تفصیل" },
  "Inflow Ledger (Cr)": { en: "Inflow Ledger (Cr)", ur: "آمدنی لیجر (جمع)" },
  "Outflow Ledger (Dr)": { en: "Outflow Ledger (Dr)", ur: "اخراجات لیجر (بنام)" },
  "Voucher No": { en: "Voucher No", ur: "واؤچر نمبر" },
  "Customer Invoice": { en: "Customer Invoice", ur: "گاہک انوائس" },
  "Supplier Milk Intake": { en: "Supplier Milk Intake", ur: "سپلائر دودھ کی آمد" },
  "Direct Operating Cost": { en: "Direct Operating Cost", ur: "براہ راست آپریٹنگ لاگت" },
  "Staff Payroll Ledger": { en: "Staff Payroll Ledger", ur: "عملے کا پے رول لیجر" },
  "Revenue / Cash Sales": { en: "Revenue / Cash Sales", ur: "آمدنی / نقد فروخت" },
  "POS Counter Walk-In Sales": { en: "POS Counter Walk-In Sales", ur: "پی او ایس کاؤنٹر سیلز" },
  "Cost of Goods Sold (COGS)": { en: "Cost of Goods Sold (COGS)", ur: "فروخت شدہ اشیاء کی لاگت" },
  "Raw Milk Intake from Farmers": { en: "Raw Milk Intake from Farmers", ur: "کسانوں سے حاصل شدہ خام دودھ" },
  "Operating Overhead (OPEX)": { en: "Operating Overhead (OPEX)", ur: "آپریٹنگ اخراجات" },
  "Rent, Ice Blocks, Salaries, Utilities": { en: "Rent, Ice Blocks, Salaries, Utilities", ur: "کرایہ، برف کے بلاکس، تنخواہیں، بلز" },
  "Net Retained Business Profit": { en: "Net Retained Business Profit", ur: "خالص کاروباری منافع" },
  "Cumulative Balance Margin": { en: "Cumulative Balance Margin", ur: "مجموعی بیلنس مارجن" },
  "Subhanallah Retail Outlet Financial Position Summary": {
    en: "Subhanallah Retail Outlet Financial Position Summary",
    ur: "سبحان اللہ ریٹیل آؤٹ لیٹ کی مالیاتی پوزیشن کا خلاصہ"
  },
  "Financial Ledger (Excel View style)": {
    en: "Financial Ledger (Excel View style)",
    ur: "مالیاتی لیجر (ایکسل ویو اسٹائل)"
  },
  "System Audit Log": {
    en: "System Audit Log",
    ur: "سسٹم آڈٹ لاگ"
  },
  "Comprehensive list of all actions performed inside the Subhanallah Milk Shop ERP system. All activities are securely tracked.": {
    en: "Comprehensive list of all actions performed inside the Subhanallah Milk Shop ERP system. All activities are securely tracked.",
    ur: "سبحان اللہ ملک شاپ ای آر پی سسٹم میں کی جانے والی تمام کارروائیوں کی جامع فہرست۔ تمام سرگرمیاں محفوظ طریقے سے ریکارڈ کی جاتی ہیں۔"
  },
  "Active": { en: "Active", ur: "فعال" },
  "Inactive": { en: "Inactive", ur: "غیر فعال" },
  "Pending": { en: "Pending", ur: "زیرِ التواء" },
  "Paid": { en: "Paid", ur: "ادا شدہ" },
  "Completed": { en: "Completed", ur: "مکمل" },
  "Morning": { en: "Morning", ur: "صبح" },
  "Evening": { en: "Evening", ur: "شام" },
  "Receive Payment": { en: "Receive Payment", ur: "ادائیگی وصول کریں" },
  "Est. Monthly Bill": { en: "Est. Monthly Bill", ur: "ماہانہ تخمینی بل" },
  "Daily Quota (M/E)": { en: "Daily Quota (M/E)", ur: "روزانہ کوٹہ (صبح/شام)" },
  "Rate Applied": { en: "Rate Applied", ur: "لاگو کردہ ریٹ" },
  "Customer Profile": { en: "Customer Profile", ur: "گاہک پروفائل" },
  "Alt Phone": { en: "Alt Phone", ur: "متبادل فون" },
  "Digitised Khata Ledger records and delivery quantities": {
    en: "Digitised Khata Ledger records and delivery quantities",
    ur: "ڈیجیٹائزڈ کھاتہ لیجر اور ڈیلیوری ریکارڈز"
  },
  "Standard evening milk. Temperature slightly high.": {
    en: "Standard evening milk. Temperature slightly high.",
    ur: "معیاری شام کا دودھ۔ درجہ حرارت تھوڑا زیادہ ہے۔"
  },
  "Clean mixed milk. Water addition tested: 0%.": {
    en: "Clean mixed milk. Water addition tested: 0%.",
    ur: "صاف مکس دودھ۔ پانی کی ملاوٹ کا ٹیسٹ: 0٪۔"
  },
  "Good quality cow milk, light yellow tint.": {
    en: "Good quality cow milk, light yellow tint.",
    ur: "اچھی کوالٹی کا گائے کا دودھ، ہلکا پیلا رنگ۔"
  },
  "Good rich evening supply.": {
    en: "Good rich evening supply.",
    ur: "شام کی عمدہ اور گاڑھی سپلائی۔"
  }
};
