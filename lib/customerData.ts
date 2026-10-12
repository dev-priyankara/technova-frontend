export type OrderItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  sku?: string;
  specs?: string;
};

export type Order = {
  id: string;
  date: string;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  items: OrderItem[];
  shippingAddress: {
    recipientName: string;
    street: string;
    city: string;
    district: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: {
    type: string;
    details: string;
    status: string;
  };
  trackingNumber?: string;
  deliveryDate?: string;
};

export const dummyOrders: Order[] = [
  {
    id: "ORD-94821",
    date: "2026-10-08",
    status: "Pending",
    items: [
      {
        id: "item-1",
        name: "ASUS ROG Strix G16 Gaming Laptop",
        category: "Laptops",
        quantity: 1,
        price: 445000,
        sku: "G614JU-N3111W",
        specs: "Intel i7-13650HX, 16GB DDR5, RTX 4060, 512GB SSD",
      },
      {
        id: "item-2",
        name: "Logitech G502 HERO High Performance Gaming Mouse",
        category: "Gaming Accessories",
        quantity: 1,
        price: 19500,
        sku: "910-005469",
        specs: "25,600 DPI, 11 Programmable Buttons, RGB",
      },
    ],
    shippingAddress: {
      recipientName: "Kasun Perera",
      street: "No. 42, Galle Road, Bambalapitiya",
      city: "Colombo 04",
      district: "Western Province",
      postalCode: "00400",
      phone: "+94 77 123 4567",
    },
    paymentMethod: {
      type: "PayHere Online Gateway",
      details: "Visa ending in •••• 4111",
      status: "Authorized / Verification in progress",
    },
    trackingNumber: "TN-EXP-2026-9482",
    deliveryDate: "Estimated Oct 13, 2026",
  },
  {
    id: "ORD-89312",
    date: "2026-10-02",
    status: "Processing",
    items: [
      {
        id: "item-3",
        name: "AMD Ryzen 7 7800X3D Desktop Processor",
        category: "Processors",
        quantity: 1,
        price: 148000,
        sku: "100-100000910WOF",
        specs: "8 Cores, 16 Threads, 104MB 3D V-Cache, AM5",
      },
      {
        id: "item-4",
        name: "NVIDIA GeForce RTX 4070 Super 12GB GDDR6X",
        category: "Graphics Cards",
        quantity: 1,
        price: 245000,
        sku: "RTX4070S-VENTUS",
        specs: "12GB GDDR6X, DLSS 3.5, Dual Fan",
      },
      {
        id: "item-5",
        name: "Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz",
        category: "Memory",
        quantity: 1,
        price: 42500,
        sku: "CMH32GX5M2B6000C30",
        specs: "32GB (2x16GB), CL30, AMD EXPO & XMP 3.0",
      },
    ],
    shippingAddress: {
      recipientName: "Kasun Perera",
      street: "No. 42, Galle Road, Bambalapitiya",
      city: "Colombo 04",
      district: "Western Province",
      postalCode: "00400",
      phone: "+94 77 123 4567",
    },
    paymentMethod: {
      type: "PayHere Online Gateway",
      details: "MasterCard ending in •••• 5555",
      status: "Paid & Verified",
    },
    trackingNumber: "TN-DOM-89312-LK",
    deliveryDate: "Estimated Oct 11, 2026",
  },
  {
    id: "ORD-76120",
    date: "2026-09-18",
    status: "Delivered",
    items: [
      {
        id: "item-6",
        name: "Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 SSD",
        category: "Storage",
        quantity: 1,
        price: 65000,
        sku: "MZ-V9P2T0BW",
        specs: "7,450 MB/s Read, 6,900 MB/s Write",
      },
      {
        id: "item-7",
        name: "Razer BlackWidow V4 Mechanical Gaming Keyboard",
        category: "Gaming Accessories",
        quantity: 1,
        price: 36500,
        sku: "RZ03-04690100",
        specs: "Green Clicky Switches, Chroma RGB, USB-C",
      },
    ],
    shippingAddress: {
      recipientName: "Kasun Perera",
      street: "No. 42, Galle Road, Bambalapitiya",
      city: "Colombo 04",
      district: "Western Province",
      postalCode: "00400",
      phone: "+94 77 123 4567",
    },
    paymentMethod: {
      type: "Bank Transfer / Card Online",
      details: "Visa ending in •••• 4111",
      status: "Paid",
    },
    trackingNumber: "TN-DLV-76120-CMP",
    deliveryDate: "Delivered on Sep 21, 2026",
  },
  {
    id: "ORD-65044",
    date: "2026-08-11",
    status: "Delivered",
    items: [
      {
        id: "item-8",
        name: "ASUS TUF Gaming VG27AQ 27-inch QHD 165Hz Monitor",
        category: "Monitors",
        quantity: 1,
        price: 98000,
        sku: "VG27AQ-TUF",
        specs: "27-inch IPS, 2560x1440, 165Hz, 1ms, G-Sync",
      },
    ],
    shippingAddress: {
      recipientName: "Kasun Perera",
      street: "No. 42, Galle Road, Bambalapitiya",
      city: "Colombo 04",
      district: "Western Province",
      postalCode: "00400",
      phone: "+94 77 123 4567",
    },
    paymentMethod: {
      type: "PayHere Online Gateway",
      details: "Visa ending in •••• 4111",
      status: "Paid",
    },
    trackingNumber: "TN-DLV-65044-OK",
    deliveryDate: "Delivered on Aug 14, 2026",
  },
];

export function getOrderById(id: string): Order {
  const found = dummyOrders.find(
    (order) => order.id.toLowerCase() === id.toLowerCase() || order.id.replace(/\D/g, "") === id.replace(/\D/g, ""),
  );

  if (found) {
    return found;
  }

  // Fallback order if unknown ID entered in URL
  return {
    id: id.toUpperCase().startsWith("ORD-") ? id.toUpperCase() : `ORD-${id}`,
    date: "2026-10-09",
    status: "Pending",
    items: [
      {
        id: "item-gen-1",
        name: "Lenovo Legion Pro 5 Gen 8 Gaming Laptop",
        category: "Laptops",
        quantity: 1,
        price: 520000,
        sku: "82WK0046US",
        specs: "AMD Ryzen 7 7745HX, 32GB DDR5, RTX 4070 8GB, 1TB NVMe",
      },
    ],
    shippingAddress: {
      recipientName: "Kasun Perera",
      street: "No. 42, Galle Road, Bambalapitiya",
      city: "Colombo 04",
      district: "Western Province",
      postalCode: "00400",
      phone: "+94 77 123 4567",
    },
    paymentMethod: {
      type: "PayHere Online Gateway",
      details: "Visa ending in •••• 4111",
      status: "Processing",
    },
    trackingNumber: "TN-EXP-GEN-LK",
    deliveryDate: "Estimated 2-3 Business Days",
  };
}

export function calculateOrderTotals(order: Order) {
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Crucial Business Rule:
  // If subtotal is over LKR 400,000, show a 2% discount applied!
  const isDiscountEligible = subtotal > 400000;
  const discountRate = isDiscountEligible ? 0.02 : 0;
  const discountAmount = isDiscountEligible ? Math.round(subtotal * discountRate) : 0;
  const shippingFee = subtotal > 50000 ? 0 : 1500;
  const finalAmount = subtotal - discountAmount + shippingFee;

  return {
    subtotal,
    isDiscountEligible,
    discountRate,
    discountAmount,
    shippingFee,
    finalAmount,
  };
}

