// Frontend-only customer auth (localStorage).
// NOTE: passwords are stored in plaintext here because there is no backend
// wired yet. Replace these calls with real API requests when the backend
// authentication endpoints are available.

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
};

const CUSTOMERS_KEY = "technova_customers";
const SESSION_KEY = "technova_session";

function readCustomers(): Customer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    return raw ? (JSON.parse(raw) as Customer[]) : [];
  } catch {
    return [];
  }
}

function writeCustomers(customers: Customer[]): void {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
}

function createId(): string {
  return `cust_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function registerCustomer(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Customer {
  const customers = readCustomers();
  const exists = customers.some(
    (customer) => customer.email.toLowerCase() === data.email.trim().toLowerCase(),
  );
  if (exists) {
    throw new Error("An account with this email already exists.");
  }

  const customer: Customer = {
    id: createId(),
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    password: data.password,
    createdAt: new Date().toISOString(),
  };

  customers.push(customer);
  writeCustomers(customers);
  return customer;
}

export function loginCustomer(email: string, password: string): Customer {
  const customers = readCustomers();
  const customer = customers.find(
    (item) =>
      item.email.toLowerCase() === email.trim().toLowerCase() &&
      item.password === password,
  );
  if (!customer) {
    throw new Error("Invalid email or password.");
  }
  return customer;
}

export function setSession(customer: Customer): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(customer));
}

export function getSession(): Customer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Customer) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
