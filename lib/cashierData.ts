// Mock Data and Business Logic Store for TECHNOVA Computers Cashier POS System

export type POSProduct = {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  stockQty: number;
  specs: string;
  warranty: string;
  badge?: string;
};

export type POSCartItem = {
  product: POSProduct;
  qty: number;
  lineTotal: number;
};

export type POSTransaction = {
  id: string;
  receiptNo: string;
  cashierName: string;
  registerId: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    sku: string;
    qty: number;
    price: number;
    lineTotal: number;
    warranty: string;
  }>;
  subtotal: number;
  discount: number; // 2% automatic discount when subtotal > 400,000 LKR
  finalAmount: number;
  paymentMethod: "Cash" | "Card (POS EDC)" | "Bank Transfer";
  cashTendered?: number;
  changeDue?: number;
  cardRef?: string;
  status: "Completed" | "Refunded" | "Reprinted";
};

export type CashierShift = {
  cashierId: string;
  cashierName: string;
  registerId: string;
  shiftStart: string;
  openingFloat: number;
  cashSales: number;
  cardSales: number;
  bankTransferSales: number;
  totalSales: number;
  discountsTotal: number;
  transactionCount: number;
  expectedCashInDrawer: number;
};

export type WalkInCustomer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  totalVisits: number;
  totalSpent: number;
  lastPurchaseDate: string;
};

// ========================================================
// BUSINESS LOGIC: 2% DISCOUNT RULE (> 400,000 LKR)
// ========================================================
export const DISCOUNT_THRESHOLD = 400000;
export const DISCOUNT_RATE = 0.02;

export function calculatePOSTotals(subtotal: number): {
  subtotal: number;
  discount: number;
  finalAmount: number;
  discountApplied: boolean;
  amountNeededForDiscount: number;
} {
  const discountApplied = subtotal > DISCOUNT_THRESHOLD;
  const discount = discountApplied ? Math.round(subtotal * DISCOUNT_RATE) : 0;
  const finalAmount = subtotal - discount;
  const amountNeededForDiscount = discountApplied ? 0 : DISCOUNT_THRESHOLD - subtotal;

  return {
    subtotal,
    discount,
    finalAmount,
    discountApplied,
    amountNeededForDiscount,
  };
}

// ========================================================
// INITIAL MOCK DATA
// ========================================================

export const mockPOSCategories = [
  "All Items",
  "Processors (CPUs)",
  "Graphics Cards (GPUs)",
  "Laptops & Notebooks",
  "Motherboards",
  "RAM & Memory",
  "Storage (SSDs)",
  "Monitors",
  "Power Supplies",
  "Peripherals",
];

export const mockPOSProducts: POSProduct[] = [
  {
    id: "pos-prod-01",
    name: "ASUS ROG Strix G16 (2024) Gaming Laptop",
    category: "Laptops & Notebooks",
    sku: "G614JU-N3111W",
    price: 445000,
    stockQty: 8,
    specs: "Core i7-13650HX, 16GB DDR5, RTX 4060 8GB, 512GB NVMe, 165Hz",
    warranty: "2 Years ASUS Global Warranty",
    badge: "Over 400k (2% Disc)",
  },
  {
    id: "pos-prod-02",
    name: "MSI GeForce RTX 4070 Super Ventus 2X",
    category: "Graphics Cards (GPUs)",
    sku: "RTX4070S-VENTUS",
    price: 245000,
    stockQty: 5,
    specs: "12GB GDDR6X, 192-bit, Dual Torx Fan 4.0, PCIe 4.0",
    warranty: "3 Years Nanotek Warranty",
  },
  {
    id: "pos-prod-03",
    name: "AMD Ryzen 7 7800X3D Desktop Processor",
    category: "Processors (CPUs)",
    sku: "100-100000910WOF",
    price: 148000,
    stockQty: 6,
    specs: "8 Cores / 16 Threads, 104MB 3D V-Cache, AM5 Socket",
    warranty: "3 Years Agent Warranty",
    badge: "Best Seller",
  },
  {
    id: "pos-prod-04",
    name: "Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz",
    category: "RAM & Memory",
    sku: "CMH32GX5M2B6000C30",
    price: 42500,
    stockQty: 18,
    specs: "32GB (2x16GB), CL30, AMD EXPO & Intel XMP 3.0",
    warranty: "Lifetime Limited Warranty",
  },
  {
    id: "pos-prod-05",
    name: "Samsung 990 PRO 2TB PCIe 4.0 NVMe SSD",
    category: "Storage (SSDs)",
    sku: "MZ-V9P2T0BW",
    price: 65000,
    stockQty: 12,
    specs: "7,450 MB/s Read, 6,900 MB/s Write, Heatsink Ready",
    warranty: "5 Years Agent Warranty",
  },
  {
    id: "pos-prod-06",
    name: "ASUS TUF Gaming VG27AQ 27\" 165Hz 2K Monitor",
    category: "Monitors",
    sku: "VG27AQ-TUF",
    price: 98000,
    stockQty: 7,
    specs: "27-inch IPS, 2560x1440, 165Hz, 1ms, G-Sync Compatible, HDR10",
    warranty: "3 Years ASUS Warranty",
  },
  {
    id: "pos-prod-07",
    name: "Corsair RM850e 850W ATX 3.0 80+ Gold Modular PSU",
    category: "Power Supplies",
    sku: "CP-9020263-NA",
    price: 46000,
    stockQty: 9,
    specs: "850W, 80 Plus Gold, ATX 3.0 & PCIe 5.0 12VHPWR Native Cable",
    warranty: "7 Years Corsair Warranty",
  },
  {
    id: "pos-prod-08",
    name: "Gigabyte B650 AORUS Elite AX AM5 Motherboard",
    category: "Motherboards",
    sku: "B650-AORUS-AX",
    price: 84000,
    stockQty: 5,
    specs: "Socket AM5, DDR5, PCIe 5.0 M.2, Wi-Fi 6E, 2.5GbE LAN",
    warranty: "3 Years Agent Warranty",
  },
  {
    id: "pos-prod-09",
    name: "Logitech G502 X PLUS Wireless RGB Gaming Mouse",
    category: "Peripherals",
    sku: "910-006160",
    price: 38500,
    stockQty: 14,
    specs: "LIGHTSPEED Wireless, HERO 25K Sensor, Lightforce Switches",
    warranty: "2 Years Distributor Warranty",
  },
  {
    id: "pos-prod-10",
    name: "Razer BlackWidow V4 Mechanical Gaming Keyboard",
    category: "Peripherals",
    sku: "RZ03-04690200",
    price: 48000,
    stockQty: 8,
    specs: "Green Clicky Switches, Chroma RGB, Dedicated Macro Keys",
    warranty: "2 Years Distributor Warranty",
  },
  {
    id: "pos-prod-11",
    name: "Intel Core i5-14600K 14th Gen Desktop CPU",
    category: "Processors (CPUs)",
    sku: "BX8071514600K",
    price: 118000,
    stockQty: 7,
    specs: "14 Cores (6P + 8E), Up to 5.3 GHz, LGA 1700",
    warranty: "3 Years Intel Warranty",
  },
  {
    id: "pos-prod-12",
    name: "ZOTAC GAMING GeForce RTX 4060 8GB Twin Edge",
    category: "Graphics Cards (GPUs)",
    sku: "ZT-D40600E-10M",
    price: 125000,
    stockQty: 11,
    specs: "8GB GDDR6, Compact Dual Slot, IceStorm 2.0 Cooling",
    warranty: "3 Years Agent Warranty",
  },
];

export const mockWalkInCustomers: WalkInCustomer[] = [
  {
    id: "cust-walkin-01",
    name: "Walk-in Guest",
    phone: "N/A (Standard Retail)",
    city: "In-Store Walk-in",
    totalVisits: 142,
    totalSpent: 4250000,
    lastPurchaseDate: "2025-02-14",
  },
  {
    id: "cust-walkin-02",
    name: "Roshan Wickramasinghe",
    phone: "077 452 1199",
    email: "roshan.w@gmail.com",
    city: "Colombo 05",
    totalVisits: 4,
    totalSpent: 620000,
    lastPurchaseDate: "2025-02-14",
  },
  {
    id: "cust-walkin-03",
    name: "Dilshan Samarasekera",
    phone: "071 889 4432",
    email: "dilshan.tech@yahoo.com",
    city: "Dehiwala",
    totalVisits: 2,
    totalSpent: 194000,
    lastPurchaseDate: "2025-02-13",
  },
  {
    id: "cust-walkin-04",
    name: "Kavindu Jayawardena",
    phone: "076 331 7720",
    email: "kavindu.j@outlook.com",
    city: "Nugegoda",
    totalVisits: 7,
    totalSpent: 890000,
    lastPurchaseDate: "2025-02-14",
  },
  {
    id: "cust-walkin-05",
    name: "Nadeeka Fernando",
    phone: "075 992 3311",
    city: "Moratuwa",
    totalVisits: 1,
    totalSpent: 84000,
    lastPurchaseDate: "2025-02-12",
  },
];

export const mockCashierShift: CashierShift = {
  cashierId: "CSH-014",
  cashierName: "Nimal Perera",
  registerId: "POS-TERMINAL-01",
  shiftStart: "Today, 08:30 AM",
  openingFloat: 25000,
  cashSales: 388500,
  cardSales: 510000,
  bankTransferSales: 148000,
  totalSales: 1046500,
  discountsTotal: 19440,
  transactionCount: 8,
  expectedCashInDrawer: 413500, // openingFloat + cashSales
};

export const mockPOSTransactions: POSTransaction[] = [
  {
    id: "pos-tx-1001",
    receiptNo: "INV-POS-2025-0914",
    cashierName: "Nimal Perera",
    registerId: "POS-TERMINAL-01",
    date: "2025-02-14",
    time: "14:22:10",
    customerName: "Roshan Wickramasinghe",
    customerPhone: "077 452 1199",
    items: [
      {
        name: "ASUS ROG Strix G16 (2024) Gaming Laptop",
        sku: "G614JU-N3111W",
        qty: 1,
        price: 445000,
        lineTotal: 445000,
        warranty: "2 Years ASUS Warranty",
      },
      {
        name: "Corsair Vengeance RGB 32GB DDR5 6000MHz",
        sku: "CMH32GX5M2B6000C30",
        qty: 1,
        price: 42500,
        lineTotal: 42500,
        warranty: "Lifetime Warranty",
      },
    ],
    subtotal: 487500,
    discount: 9750, // 2% because > 400,000
    finalAmount: 477750,
    paymentMethod: "Cash",
    cashTendered: 500000,
    changeDue: 22250,
    status: "Completed",
  },
  {
    id: "pos-tx-1002",
    receiptNo: "INV-POS-2025-0915",
    cashierName: "Nimal Perera",
    registerId: "POS-TERMINAL-01",
    date: "2025-02-14",
    time: "13:05:42",
    customerName: "Walk-in Guest",
    customerPhone: "N/A",
    items: [
      {
        name: "MSI GeForce RTX 4070 Super Ventus 2X",
        sku: "RTX4070S-VENTUS",
        qty: 1,
        price: 245000,
        lineTotal: 245000,
        warranty: "3 Years Nanotek Warranty",
      },
      {
        name: "Corsair RM850e 850W Gold Modular PSU",
        sku: "CP-9020263-NA",
        qty: 1,
        price: 46000,
        lineTotal: 46000,
        warranty: "7 Years Warranty",
      },
    ],
    subtotal: 291000,
    discount: 0, // <= 400,000, no discount
    finalAmount: 291000,
    paymentMethod: "Card (POS EDC)",
    cardRef: "AUTH-HNB-778102",
    status: "Completed",
  },
  {
    id: "pos-tx-1003",
    receiptNo: "INV-POS-2025-0916",
    cashierName: "Nimal Perera",
    registerId: "POS-TERMINAL-01",
    date: "2025-02-14",
    time: "11:40:15",
    customerName: "Kavindu Jayawardena",
    customerPhone: "076 331 7720",
    items: [
      {
        name: "AMD Ryzen 7 7800X3D Desktop Processor",
        sku: "100-100000910WOF",
        qty: 1,
        price: 148000,
        lineTotal: 148000,
        warranty: "3 Years Agent Warranty",
      },
      {
        name: "Gigabyte B650 AORUS Elite AX AM5",
        sku: "B650-AORUS-AX",
        qty: 1,
        price: 84000,
        lineTotal: 84000,
        warranty: "3 Years Warranty",
      },
      {
        name: "Corsair Vengeance RGB 32GB DDR5 6000MHz",
        sku: "CMH32GX5M2B6000C30",
        qty: 1,
        price: 42500,
        lineTotal: 42500,
        warranty: "Lifetime Warranty",
      },
    ],
    subtotal: 274500,
    discount: 0,
    finalAmount: 274500,
    paymentMethod: "Bank Transfer",
    cardRef: "COM-TXN-990231",
    status: "Completed",
  },
  {
    id: "pos-tx-1004",
    receiptNo: "INV-POS-2025-0917",
    cashierName: "Nimal Perera",
    registerId: "POS-TERMINAL-01",
    date: "2025-02-14",
    time: "10:15:08",
    customerName: "Walk-in Guest",
    customerPhone: "N/A",
    items: [
      {
        name: "Samsung 990 PRO 2TB PCIe 4.0 NVMe SSD",
        sku: "MZ-V9P2T0BW",
        qty: 1,
        price: 65000,
        lineTotal: 65000,
        warranty: "5 Years Warranty",
      },
      {
        name: "Logitech G502 X PLUS Wireless Gaming Mouse",
        sku: "910-006160",
        price: 38500,
        qty: 1,
        lineTotal: 38500,
        warranty: "2 Years Warranty",
      },
    ],
    subtotal: 103500,
    discount: 0,
    finalAmount: 103500,
    paymentMethod: "Cash",
    cashTendered: 105000,
    changeDue: 1500,
    status: "Completed",
  },
];

