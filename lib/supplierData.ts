// Mock Data and Business Logic Store for TECHNOVA Supplier Management System

export type SupplierProfile = {
  id: string;
  vendorCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  authorizedBrands: string[];
  rating: number;
  contractStatus: "Active Distributor" | "Under Review";
  bankAccount: {
    bankName: string;
    branch: string;
    accountNo: string;
  };
};

export type SupplierProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  wholesalePrice: number;
  retailMSRP: number;
  availableStock: number;
  minOrderQty: number;
  warrantyPeriod: string;
  status: "In Stock" | "Low Supply" | "Out of Stock";
};

export type ShopBranch = {
  id: string;
  name: string;
  city: string;
  address: string;
  managerName: string;
  phone: string;
  activeLowStockCount: number;
};

export type RestockRequest = {
  id: string;
  requestNo: string;
  shopBranch: string;
  shopManager: string;
  shopPhone: string;
  requestDate: string;
  urgency: "Critical (Out of Stock)" | "High (Low Stock)" | "Normal Restock";
  items: Array<{
    productName: string;
    sku: string;
    currentShopStock: number;
    minThreshold: number;
    requestedQty: number;
    wholesalePrice: number;
    lineTotal: number;
  }>;
  totalEstValue: number;
  status: "Pending Supplier Approval" | "Accepted & Preparing" | "Dispatched" | "Declined";
  shopNotes?: string;
};

export type DeliveryDispatch = {
  id: string;
  dispatchNo: string;
  requestNo: string;
  destinationShop: string;
  shopAddress: string;
  shopContact: string;
  carrier: string;
  trackingNumber: string;
  dispatchDate: string;
  estimatedArrival: string;
  totalUnits: number;
  totalValue: number;
  status: "Preparing Dispatch" | "Dispatched" | "In-Transit" | "Delivered & Verified";
  driverName?: string;
  driverPhone?: string;
};

export type ReturnedProduct = {
  id: string;
  rmaNumber: string;
  fromShop: string;
  productName: string;
  sku: string;
  serialNumber: string;
  customerIssue: string;
  returnReason: "Dead On Arrival (DOA)" | "GPU Artifacting / Freezing" | "VRM Power Defect" | "Transit Physical Damage";
  returnDate: string;
  warrantyValid: boolean;
  status: "Pending Inspection" | "Replacement Dispatched" | "Credit Note Issued" | "Rejected (Physical Damage)";
  resolutionNotes?: string;
};

// ==========================================
// INITIAL MOCK DATA
// ==========================================

export const mockSupplierProfile: SupplierProfile = {
  id: "sup-profile-01",
  vendorCode: "VEND-NANO-7701",
  companyName: "Nanotek Distribution & Tech Solutions (Pvt) Ltd",
  contactPerson: "Dinesh Weerasinghe",
  email: "supply.orders@nanotek.lk",
  phone: "+94 11 432 9988",
  address: "Level 4, Silicon Tower, R.A. De Mel Mawatha, Colombo 03",
  taxId: "VAT-LK-889921",
  authorizedBrands: ["ASUS ROG", "MSI", "AMD Ryzen", "Corsair", "Samsung Semiconductor", "Gigabyte"],
  rating: 4.9,
  contractStatus: "Active Distributor",
  bankAccount: {
    bankName: "Commercial Bank of Ceylon",
    branch: "Kollupitiya Corporate Branch",
    accountNo: "800293881029",
  },
};

export const mockShopBranches: ShopBranch[] = [
  {
    id: "branch-colombo",
    name: "TECHNOVA Computers — Flagship Store",
    city: "Colombo 03",
    address: "No. 142, Galle Road, Bambalapitiya, Colombo 03",
    managerName: "Kasun Silva (Store Manager)",
    phone: "+94 11 234 5678",
    activeLowStockCount: 2,
  },
  {
    id: "branch-kandy",
    name: "TECHNOVA Computers — Kandy City Center",
    city: "Kandy",
    address: "Level 3, KCC Commercial Arcade, Dalada Veediya, Kandy",
    managerName: "Nuwan Bandara (Branch Head)",
    phone: "+94 81 223 9911",
    activeLowStockCount: 3,
  },
  {
    id: "branch-galle",
    name: "TECHNOVA Computers — Galle Fort Tech Hub",
    city: "Galle",
    address: "No. 45, Wakwella Road, Galle",
    managerName: "Tharindu Perera (Branch Manager)",
    phone: "+94 91 433 1200",
    activeLowStockCount: 1,
  },
];

export const mockSupplierProducts: SupplierProduct[] = [
  {
    id: "sp-101",
    name: "ASUS ROG Strix G16 (2024) Gaming Laptop",
    brand: "ASUS ROG",
    category: "Laptops & Notebooks",
    sku: "G614JU-N3111W",
    wholesalePrice: 395000,
    retailMSRP: 445000,
    availableStock: 25,
    minOrderQty: 2,
    warrantyPeriod: "2 Years ASUS Global Warranty",
    status: "In Stock",
  },
  {
    id: "sp-102",
    name: "MSI GeForce RTX 4070 Super Ventus 2X 12GB",
    brand: "MSI",
    category: "Graphics Cards (GPUs)",
    sku: "RTX4070S-VENTUS",
    wholesalePrice: 215000,
    retailMSRP: 245000,
    availableStock: 18,
    minOrderQty: 2,
    warrantyPeriod: "3 Years Nanotek Distributor Warranty",
    status: "In Stock",
  },
  {
    id: "sp-103",
    name: "AMD Ryzen 7 7800X3D Desktop Processor",
    brand: "AMD Ryzen",
    category: "Processors (CPUs)",
    sku: "100-100000910WOF",
    wholesalePrice: 128000,
    retailMSRP: 148000,
    availableStock: 30,
    minOrderQty: 3,
    warrantyPeriod: "3 Years Agent Warranty",
    status: "In Stock",
  },
  {
    id: "sp-104",
    name: "Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz",
    brand: "Corsair",
    category: "RAM & Memory",
    sku: "CMH32GX5M2B6000C30",
    wholesalePrice: 36000,
    retailMSRP: 42500,
    availableStock: 45,
    minOrderQty: 5,
    warrantyPeriod: "Lifetime Limited Warranty",
    status: "In Stock",
  },
  {
    id: "sp-105",
    name: "Samsung 990 PRO 2TB PCIe 4.0 NVMe SSD",
    brand: "Samsung Semiconductor",
    category: "Storage (SSDs)",
    sku: "MZ-V9P2T0BW",
    wholesalePrice: 54000,
    retailMSRP: 65000,
    availableStock: 12,
    minOrderQty: 3,
    warrantyPeriod: "5 Years Agent Warranty",
    status: "Low Supply",
  },
  {
    id: "sp-106",
    name: "ASUS TUF Gaming VG27AQ 27\" 165Hz QHD Monitor",
    brand: "ASUS ROG",
    category: "Monitors",
    sku: "VG27AQ-TUF",
    wholesalePrice: 82000,
    retailMSRP: 98000,
    availableStock: 16,
    minOrderQty: 2,
    warrantyPeriod: "3 Years ASUS Warranty",
    status: "In Stock",
  },
  {
    id: "sp-107",
    name: "Gigabyte B650 AORUS Elite AX AM5 Motherboard",
    brand: "Gigabyte",
    category: "Motherboards",
    sku: "B650-AORUS-AX",
    wholesalePrice: 72000,
    retailMSRP: 84000,
    availableStock: 14,
    minOrderQty: 2,
    warrantyPeriod: "3 Years Agent Warranty",
    status: "In Stock",
  },
  {
    id: "sp-108",
    name: "Corsair RM850e 850W Gold Modular ATX 3.0 PSU",
    brand: "Corsair",
    category: "Power Supplies",
    sku: "CP-9020263-NA",
    wholesalePrice: 39000,
    retailMSRP: 46000,
    availableStock: 22,
    minOrderQty: 4,
    warrantyPeriod: "7 Years Corsair Warranty",
    status: "In Stock",
  },
];

export const mockRestockRequests: RestockRequest[] = [
  {
    id: "req-401",
    requestNo: "REQ-TECHNOVA-2025-041",
    shopBranch: "TECHNOVA Computers — Flagship Store (Colombo 03)",
    shopManager: "Kasun Silva",
    shopPhone: "+94 77 123 4567",
    requestDate: "2025-02-14",
    urgency: "Critical (Out of Stock)",
    items: [
      {
        productName: "Samsung 990 PRO 2TB PCIe 4.0 NVMe SSD",
        sku: "MZ-V9P2T0BW",
        currentShopStock: 0,
        minThreshold: 4,
        requestedQty: 10,
        wholesalePrice: 54000,
        lineTotal: 540000,
      },
      {
        productName: "MSI GeForce RTX 4070 Super Ventus 2X",
        sku: "RTX4070S-VENTUS",
        currentShopStock: 2,
        minThreshold: 4,
        requestedQty: 5,
        wholesalePrice: 215000,
        lineTotal: 1075000,
      },
    ],
    totalEstValue: 1615000,
    status: "Pending Supplier Approval",
    shopNotes: "Urgent replenishment needed for weekend walk-in gaming PC custom builds.",
  },
  {
    id: "req-402",
    requestNo: "REQ-TECHNOVA-2025-042",
    shopBranch: "TECHNOVA Computers — Kandy City Center",
    shopManager: "Nuwan Bandara",
    shopPhone: "+94 81 223 9911",
    requestDate: "2025-02-13",
    urgency: "High (Low Stock)",
    items: [
      {
        productName: "AMD Ryzen 7 7800X3D Desktop Processor",
        sku: "100-100000910WOF",
        currentShopStock: 1,
        minThreshold: 5,
        requestedQty: 6,
        wholesalePrice: 128000,
        lineTotal: 768000,
      },
      {
        productName: "Corsair Vengeance RGB 32GB DDR5 6000MHz",
        sku: "CMH32GX5M2B6000C30",
        currentShopStock: 3,
        minThreshold: 6,
        requestedQty: 8,
        wholesalePrice: 36000,
        lineTotal: 288000,
      },
    ],
    totalEstValue: 1056000,
    status: "Accepted & Preparing",
    shopNotes: "Kandy branch stock depleted after corporate order.",
  },
  {
    id: "req-403",
    requestNo: "REQ-TECHNOVA-2025-043",
    shopBranch: "TECHNOVA Computers — Galle Fort Tech Hub",
    shopManager: "Tharindu Perera",
    shopPhone: "+94 91 433 1200",
    requestDate: "2025-02-12",
    urgency: "Normal Restock",
    items: [
      {
        productName: "ASUS TUF Gaming VG27AQ 27\" 165Hz Monitor",
        sku: "VG27AQ-TUF",
        currentShopStock: 2,
        minThreshold: 3,
        requestedQty: 4,
        wholesalePrice: 82000,
        lineTotal: 328000,
      },
    ],
    totalEstValue: 328000,
    status: "Dispatched",
    shopNotes: "Standard monthly restock cycle.",
  },
];

export const mockDeliveryDispatches: DeliveryDispatch[] = [
  {
    id: "dsp-701",
    dispatchNo: "DSP-NANO-2025-881",
    requestNo: "REQ-TECHNOVA-2025-043",
    destinationShop: "TECHNOVA Computers — Galle Fort Tech Hub",
    shopAddress: "No. 45, Wakwella Road, Galle",
    shopContact: "Tharindu Perera (+94 91 433 1200)",
    carrier: "Certis Lanka Secure Transit Logistics",
    trackingNumber: "CRT-LK-9921004",
    dispatchDate: "2025-02-13 14:30",
    estimatedArrival: "2025-02-14 11:00 AM",
    totalUnits: 4,
    totalValue: 328000,
    status: "In-Transit",
    driverName: "Sanath Bandara",
    driverPhone: "+94 77 982 1100",
  },
  {
    id: "dsp-702",
    dispatchNo: "DSP-NANO-2025-880",
    requestNo: "REQ-TECHNOVA-2025-039",
    destinationShop: "TECHNOVA Computers — Flagship Store (Colombo 03)",
    shopAddress: "No. 142, Galle Road, Bambalapitiya, Colombo 03",
    shopContact: "Kasun Silva (+94 11 234 5678)",
    carrier: "Nanotek Express Fleet Vehicle #WP-CAD-4412",
    trackingNumber: "EXP-COL-00918",
    dispatchDate: "2025-02-12 10:15",
    estimatedArrival: "2025-02-12 12:30 PM",
    totalUnits: 12,
    totalValue: 2450000,
    status: "Delivered & Verified",
    driverName: "Pradeep Kumara",
    driverPhone: "+94 71 445 2299",
  },
  {
    id: "dsp-703",
    dispatchNo: "DSP-NANO-2025-882",
    requestNo: "REQ-TECHNOVA-2025-042",
    destinationShop: "TECHNOVA Computers — Kandy City Center",
    shopAddress: "Level 3, KCC Commercial Arcade, Dalada Veediya, Kandy",
    shopContact: "Nuwan Bandara (+94 81 223 9911)",
    carrier: "Pronto Lanka Inter-City Courier",
    trackingNumber: "PRN-KDY-88412",
    dispatchDate: "2025-02-14 09:00",
    estimatedArrival: "2025-02-15 02:00 PM",
    totalUnits: 14,
    totalValue: 1056000,
    status: "Preparing Dispatch",
  },
];

export const mockReturnedProducts: ReturnedProduct[] = [
  {
    id: "rma-501",
    rmaNumber: "RMA-NANO-2025-091",
    fromShop: "TECHNOVA Computers — Flagship Store (Colombo 03)",
    productName: "MSI GeForce RTX 4070 Super Ventus 2X",
    sku: "RTX4070S-VENTUS",
    serialNumber: "SN: 602-V513-220S2401004128",
    customerIssue: "Screen blackouts and severe artifacts after 30 minutes in FurMark stress test.",
    returnReason: "GPU Artifacting / Freezing",
    returnDate: "2025-02-13",
    warrantyValid: true,
    status: "Pending Inspection",
    resolutionNotes: "Received at Nanotek QA Lab. Technician testing memory thermal pads.",
  },
  {
    id: "rma-502",
    rmaNumber: "RMA-NANO-2025-092",
    fromShop: "TECHNOVA Computers — Kandy City Center",
    productName: "Gigabyte B650 AORUS Elite AX AM5",
    sku: "B650-AORUS-AX",
    serialNumber: "SN: SN23490001844",
    customerIssue: "Unit fails to POST, debug LED stays stuck on CPU red LED with known good 7800X3D.",
    returnReason: "Dead On Arrival (DOA)",
    returnDate: "2025-02-11",
    warrantyValid: true,
    status: "Replacement Dispatched",
    resolutionNotes: "DOA verified. Brand new replacement unit dispatched under DSP-NANO-2025-882.",
  },
  {
    id: "rma-503",
    rmaNumber: "RMA-NANO-2025-089",
    fromShop: "TECHNOVA Computers — Galle Fort Tech Hub",
    productName: "Corsair RM850e 850W Gold Modular PSU",
    sku: "CP-9020263-NA",
    serialNumber: "SN: 23417932000041",
    customerIssue: "No 12V output. Power supply makes faint clicking noise upon paperclip test.",
    returnReason: "VRM Power Defect",
    returnDate: "2025-02-08",
    warrantyValid: true,
    status: "Credit Note Issued",
    resolutionNotes: "Internal relay failure confirmed. Full credit note CR-NANO-4410 credited to shop.",
  },
];

