export type AdminUserRole = "Admin" | "Cashier" | "Supplier" | "Customer";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  phone: string;
  status: "Active" | "Inactive";
  createdAt: string;
};

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  sku: string;
  costPrice: number;
  sellingPrice: number;
  stockQty: number;
  minStockLevel: number;
  specs: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  createdAt?: string;
};

export type TimeFilterPeriod = "all" | "today" | "weekly" | "monthly";

export function isDateInPeriod(dateString?: string, period: TimeFilterPeriod = "all"): boolean {
  if (period === "all") return true;
  if (!dateString) return false;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;

  const now = new Date();
  const itemDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  if (period === "today") {
    return itemDay === today;
  }

  if (period === "weekly") {
    const diffDays = (today - itemDay) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  }

  if (period === "monthly") {
    const isSameMonth = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    const diffDays = (today - itemDay) / (1000 * 60 * 60 * 24);
    return isSameMonth || (diffDays >= 0 && diffDays <= 30);
  }

  return true;
}

export type AdminCategory = {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  slug: string;
};

export type AdminPOSTransaction = {
  id: string;
  receiptNo: string;
  cashierName: string;
  date: string;
  time: string;
  subtotal: number;
  discount: number; // 2% if subtotal > 400,000 LKR
  finalAmount: number;
  paymentMethod: "Cash" | "Card (PayHere)" | "Bank Transfer";
  itemsCount: number;
};

export type AdminOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  totalAmount: number;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  paymentStatus: "Paid" | "Pending Verification";
  itemsSummary: string;
};

export type AdminSupplier = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  suppliedCategories: string[];
  pendingRequests: number;
  status: "Active" | "Pending Verification";
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
};

// ==========================================
// MOCK DATA STORE
// ==========================================

export const mockAdminUsers: AdminUser[] = [
  {
    id: "usr-01",
    name: "Kasun Silva",
    email: "admin.kasun@technova.lk",
    role: "Admin",
    phone: "+94 77 123 4567",
    status: "Active",
    createdAt: "2025-01-10",
  },
  {
    id: "usr-02",
    name: "Nimal Perera",
    email: "cashier.nimal@technova.lk",
    role: "Cashier",
    phone: "+94 71 456 7890",
    status: "Active",
    createdAt: "2025-03-15",
  },
  {
    id: "usr-03",
    name: "Dinithi Fernando",
    email: "cashier.dinithi@technova.lk",
    role: "Cashier",
    phone: "+94 76 890 1234",
    status: "Active",
    createdAt: "2025-05-02",
  },
  {
    id: "usr-04",
    name: "Apex Tech Distributors",
    email: "supply@apextech.lk",
    role: "Supplier",
    phone: "+94 11 289 0011",
    status: "Active",
    createdAt: "2025-02-20",
  },
  {
    id: "usr-05",
    name: "Chamal Rajapaksha",
    email: "chamal.pos@technova.lk",
    role: "Cashier",
    phone: "+94 72 334 5566",
    status: "Inactive",
    createdAt: "2025-07-11",
  },
];

export const mockAdminCategories: AdminCategory[] = [
  { id: "cat-1", name: "Laptops & Notebooks", description: "Gaming, Ultrabooks, Workstations", itemCount: 28, slug: "laptops" },
  { id: "cat-2", name: "Processors (CPUs)", description: "Intel Core & AMD Ryzen Desktop CPUs", itemCount: 19, slug: "processors" },
  { id: "cat-3", name: "Graphics Cards (GPUs)", description: "NVIDIA GeForce RTX & AMD Radeon", itemCount: 15, slug: "graphics-cards" },
  { id: "cat-4", name: "Motherboards", description: "ATX, Micro-ATX, Mini-ITX Intel/AMD", itemCount: 22, slug: "motherboards" },
  { id: "cat-5", name: "RAM & Memory", description: "DDR4 & DDR5 High Performance RAM", itemCount: 34, slug: "memory" },
  { id: "cat-6", name: "Storage (SSDs & HDDs)", description: "NVMe Gen4, SATA SSDs, Enterprise HDDs", itemCount: 41, slug: "storage" },
  { id: "cat-7", name: "Monitors", description: "Gaming 144Hz-240Hz, 4K Productivity", itemCount: 18, slug: "monitors" },
  { id: "cat-8", name: "Power Supplies (PSU)", description: "80 Plus Bronze/Gold/Platinum", itemCount: 16, slug: "power-supplies" },
];

export const mockAdminProducts: AdminProduct[] = [
  {
    id: "prod-101",
    name: "ASUS ROG Strix G16 (2024)",
    category: "Laptops & Notebooks",
    sku: "G614JU-N3111W",
    costPrice: 395000,
    sellingPrice: 445000,
    stockQty: 8,
    minStockLevel: 3,
    specs: "Core i7-13650HX, 16GB DDR5, RTX 4060, 512GB SSD",
    status: "In Stock",
    createdAt: "2026-10-27",
  },
  {
    id: "prod-102",
    name: "AMD Ryzen 7 7800X3D Processor",
    category: "Processors (CPUs)",
    sku: "100-100000910WOF",
    costPrice: 128000,
    sellingPrice: 148000,
    stockQty: 4,
    minStockLevel: 5,
    specs: "8 Cores, 16 Threads, 104MB Cache, AM5 Socket",
    status: "Low Stock",
    createdAt: "2026-10-27",
  },
  {
    id: "prod-103",
    name: "MSI GeForce RTX 4070 Super Ventus 2X",
    category: "Graphics Cards (GPUs)",
    sku: "RTX4070S-VENTUS",
    costPrice: 215000,
    sellingPrice: 245000,
    stockQty: 2,
    minStockLevel: 4,
    specs: "12GB GDDR6X, DLSS 3.5, Dual Fan Cooling",
    status: "Low Stock",
    createdAt: "2026-10-25",
  },
  {
    id: "prod-104",
    name: "Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz",
    category: "RAM & Memory",
    sku: "CMH32GX5M2B6000C30",
    costPrice: 36000,
    sellingPrice: 42500,
    stockQty: 18,
    minStockLevel: 6,
    specs: "32GB Kit, CL30, AMD EXPO & Intel XMP 3.0",
    status: "In Stock",
    createdAt: "2026-10-23",
  },
  {
    id: "prod-105",
    name: "Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 SSD",
    category: "Storage (SSDs & HDDs)",
    sku: "MZ-V9P2T0BW",
    costPrice: 54000,
    sellingPrice: 65000,
    stockQty: 0,
    minStockLevel: 4,
    specs: "7,450 MB/s Read, 6,900 MB/s Write",
    status: "Out of Stock",
    createdAt: "2026-10-14",
  },
  {
    id: "prod-106",
    name: "ASUS TUF Gaming VG27AQ 27\" 165Hz QHD Monitor",
    category: "Monitors",
    sku: "VG27AQ-TUF",
    costPrice: 82000,
    sellingPrice: 98000,
    stockQty: 7,
    minStockLevel: 3,
    specs: "27-inch IPS, 2560x1440, 165Hz, 1ms, G-Sync Compatible",
    status: "In Stock",
    createdAt: "2026-10-06",
  },
  {
    id: "prod-107",
    name: "Corsair RM850e 850W ATX 3.0 80+ Gold Fully Modular",
    category: "Power Supplies (PSU)",
    sku: "CP-9020263-NA",
    costPrice: 38000,
    sellingPrice: 46000,
    stockQty: 12,
    minStockLevel: 4,
    specs: "850W, 80 PLUS Gold, ATX 3.0, PCIe 5.0 12VHPWR",
    status: "In Stock",
    createdAt: "2026-09-18",
  },
];

export const mockAdminPOSTransactions: AdminPOSTransaction[] = [
  {
    id: "pos-8841",
    receiptNo: "REC-2026-10491",
    cashierName: "Nimal Perera",
    date: "2026-10-13",
    time: "14:22",
    subtotal: 512000,
    discount: 10240, // 2% automatic discount (Subtotal > 400,000 LKR)
    finalAmount: 501760,
    paymentMethod: "Card (PayHere)",
    itemsCount: 3,
  },
  {
    id: "pos-8840",
    receiptNo: "REC-2026-10490",
    cashierName: "Dinithi Fernando",
    date: "2026-10-13",
    time: "11:45",
    subtotal: 148000,
    discount: 0,
    finalAmount: 148000,
    paymentMethod: "Cash",
    itemsCount: 1,
  },
  {
    id: "pos-8839",
    receiptNo: "REC-2026-10489",
    cashierName: "Nimal Perera",
    date: "2026-10-12",
    time: "17:30",
    subtotal: 445000,
    discount: 8900, // 2% automatic discount (>400,000)
    finalAmount: 436100,
    paymentMethod: "Card (PayHere)",
    itemsCount: 2,
  },
  {
    id: "pos-8838",
    receiptNo: "REC-2026-10488",
    cashierName: "Nimal Perera",
    date: "2026-10-12",
    time: "15:10",
    subtotal: 42500,
    discount: 0,
    finalAmount: 42500,
    paymentMethod: "Cash",
    itemsCount: 1,
  },
  {
    id: "pos-8837",
    receiptNo: "REC-2026-10487",
    cashierName: "Dinithi Fernando",
    date: "2026-10-11",
    time: "13:05",
    subtotal: 720000,
    discount: 14400, // 2% automatic discount (>400,000)
    finalAmount: 705600,
    paymentMethod: "Bank Transfer",
    itemsCount: 4,
  },
];

export const mockAdminOrders: AdminOrder[] = [
  {
    id: "ORD-94821",
    customerName: "Kasun Perera",
    customerPhone: "+94 77 123 4567",
    date: "2026-10-27",
    totalAmount: 464500,
    status: "Pending",
    paymentStatus: "Paid",
    itemsSummary: "ASUS ROG Strix G16 + Logitech G502 HERO",
  },
  {
    id: "ORD-94820",
    customerName: "Dilshan Wickrama",
    customerPhone: "+94 71 456 7890",
    date: "2026-10-27",
    totalAmount: 148000,
    status: "Processing",
    paymentStatus: "Paid",
    itemsSummary: "AMD Ryzen 7 7800X3D Processor",
  },
  {
    id: "ORD-89312",
    customerName: "Mahesh Jayawardena",
    customerPhone: "+94 71 889 2233",
    date: "2026-10-25",
    totalAmount: 435500,
    status: "Processing",
    paymentStatus: "Paid",
    itemsSummary: "Ryzen 7 7800X3D + RTX 4070 Super + Corsair 32GB",
  },
  {
    id: "ORD-88150",
    customerName: "Kamal Senanayake",
    customerPhone: "+94 77 990 1122",
    date: "2026-10-22",
    totalAmount: 245000,
    status: "Delivered",
    paymentStatus: "Paid",
    itemsSummary: "MSI GeForce RTX 4070 Super Ventus 2X",
  },
  {
    id: "ORD-87104",
    customerName: "Sanduni Gamage",
    customerPhone: "+94 76 554 1122",
    date: "2026-10-10",
    totalAmount: 98000,
    status: "Delivered",
    paymentStatus: "Paid",
    itemsSummary: "ASUS TUF VG27AQ 27\" Monitor",
  },
  {
    id: "ORD-76120",
    customerName: "Rashmi Wickramasinghe",
    customerPhone: "+94 76 554 3344",
    date: "2026-09-18",
    totalAmount: 101500,
    status: "Delivered",
    paymentStatus: "Paid",
    itemsSummary: "Samsung 990 PRO 2TB + Razer Keyboard",
  },
  {
    id: "ORD-65044",
    customerName: "Thilina Alwis",
    customerPhone: "+94 70 332 9988",
    date: "2026-08-11",
    totalAmount: 46000,
    status: "Delivered",
    paymentStatus: "Paid",
    itemsSummary: "Corsair RM850e 850W ATX 3.0 Gold PSU",
  },
];

export const mockAdminSuppliers: AdminSupplier[] = [
  {
    id: "sup-01",
    companyName: "Apex Tech Distribution PLC",
    contactPerson: "Sunil Amarasinghe",
    email: "supply@apextech.lk",
    phone: "+94 11 289 0011",
    suppliedCategories: ["Graphics Cards", "Processors", "Motherboards"],
    pendingRequests: 2,
    status: "Active",
  },
  {
    id: "sup-02",
    companyName: "Lanka Micro Components (Pvt) Ltd",
    contactPerson: "Priyantha Kumara",
    email: "orders@lankamicro.lk",
    phone: "+94 11 450 6789",
    suppliedCategories: ["RAM & Memory", "Storage (SSDs & HDDs)"],
    pendingRequests: 1,
    status: "Active",
  },
  {
    id: "sup-03",
    companyName: "Global Gaming Gear Importers",
    contactPerson: "Faris Mohamed",
    email: "faris@gggimporters.com",
    phone: "+94 77 990 4433",
    suppliedCategories: ["Gaming Accessories", "Monitors"],
    pendingRequests: 0,
    status: "Active",
  },
];

export const mockAdminCustomers: AdminCustomer[] = [
  {
    id: "cust-01",
    name: "Kasun Perera",
    email: "kasun.perera@example.lk",
    phone: "+94 77 123 4567",
    city: "Colombo 04",
    ordersCount: 4,
    totalSpent: 985000,
    joinedDate: "2025-04-12",
  },
  {
    id: "cust-02",
    name: "Mahesh Jayawardena",
    email: "mahesh.j@gmail.com",
    phone: "+94 71 889 2233",
    city: "Kandy",
    ordersCount: 2,
    totalSpent: 485000,
    joinedDate: "2025-06-18",
  },
  {
    id: "cust-03",
    name: "Rashmi Wickramasinghe",
    email: "rashmi.w@outlook.com",
    phone: "+94 76 554 1122",
    city: "Galle",
    ordersCount: 3,
    totalSpent: 260000,
    joinedDate: "2025-08-01",
  },
  {
    id: "cust-04",
    name: "Thilina Alwis",
    email: "thilina.alwis@yahoo.com",
    phone: "+94 70 332 9988",
    city: "Negombo",
    ordersCount: 1,
    totalSpent: 98000,
    joinedDate: "2025-08-10",
  },
];

export const mockAdminStats = {
  todaySalesLKR: 649760,
  monthlySalesLKR: 8420000,
  totalProductsCount: 193,
  lowStockAlertsCount: 6,
  outOfStockCount: 2,
  activeCashiersCount: 2,
  activeSuppliersCount: 3,
  pendingOrdersCount: 2,
};

