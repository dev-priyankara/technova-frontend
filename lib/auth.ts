export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  role?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  token?: string;
  password?: string;
};

type CustomerResponse = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
  street?: string;
  city?: string;
  postal_code?: string;
  created_at: string;
  access_token?: string;
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const SESSION_KEY = "technova_session";
const PENDING_REGISTRATION_KEY = "technova_pending_registration";

export interface PendingRegistration {
  name: string;
  email: string;
  phone: string;
  password: string;
  verification_code: string;
}

export function setPendingRegistration(data: PendingRegistration): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_REGISTRATION_KEY, JSON.stringify(data));
}

export function getPendingRegistration(): PendingRegistration | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PENDING_REGISTRATION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingRegistration;
  } catch {
    return null;
  }
}

export function clearPendingRegistration(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PENDING_REGISTRATION_KEY);
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = getSession();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (session?.token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorDetail =
      data && typeof data === "object" && "detail" in data
        ? data.detail
        : data && typeof data === "object" && "message" in data
        ? data.message
        : `Request failed with status ${response.status}`;
    throw new Error(typeof errorDetail === "string" ? errorDetail : JSON.stringify(errorDetail));
  }

  return data as T;
}

async function authRequest(
  endpoint: string,
  body?: Record<string, any>,
): Promise<Customer> {
  const payload = await apiFetch<CustomerResponse>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!payload || !payload.id) {
    throw new Error("The server returned an invalid response.");
  }

  return {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    phone: payload.phone || "",
    role: payload.role || "Customer",
    street: payload.street || "",
    city: payload.city || "",
    postalCode: payload.postal_code || "",
    createdAt: payload.created_at,
    token: payload.access_token || undefined,
  };
}

export function registerCustomer(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<Customer> {
  return authRequest("/auth/register", data);
}

export function loginCustomer(email: string, password: string): Promise<Customer> {
  return authRequest("/auth/login", { email, password });
}

export async function updateCustomerProfile(data: {
  name: string;
  phone: string;
  street: string;
  city: string;
  postal_code: string;
}): Promise<Customer> {
  const payload = await apiFetch<CustomerResponse>("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const session = getSession();
  const updated: Customer = {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    phone: payload.phone || "",
    role: payload.role || session?.role || "Customer",
    street: payload.street || "",
    city: payload.city || "",
    postalCode: payload.postal_code || "",
    createdAt: payload.created_at,
    token: session?.token,
  };
  setSession(updated);
  return updated;
}

export function updateCustomerPassword(data: {
  current_password: string;
  new_password: string;
}): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/password", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function setSession(customer: Customer): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(customer));
}

export function getSession(): Customer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Partial<Customer>;
    if (
      typeof stored.id !== "string" ||
      typeof stored.name !== "string" ||
      typeof stored.email !== "string"
    ) {
      return null;
    }
    return {
      id: stored.id,
      name: stored.name,
      email: stored.email,
      phone: stored.phone || "",
      role: stored.role || "Customer",
      street: stored.street || "",
      city: stored.city || "",
      postalCode: stored.postalCode || "",
      createdAt: stored.createdAt || new Date().toISOString(),
      token: stored.token || undefined,
    };
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  void fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch((error: unknown) => {
    console.error("Unable to clear the backend login cookie.", error);
  });
}
