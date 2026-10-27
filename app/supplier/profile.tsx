"use client";

import React, { useState, useEffect, useRef } from "react";
import { mockSupplierProfile } from "@/lib/supplierData";

export interface SupplierProfileData {
  companyName: string;
  vendorCode: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  contractStatus: string;
  bankName: string;
  bankBranch: string;
  bankAccountNo: string;
  authorizedBrands: string[];
  avatarUrl: string;
}

export const DEFAULT_SUPPLIER_PROFILE: SupplierProfileData = {
  companyName: mockSupplierProfile.companyName || "Nanotek Distribution (Pvt) Ltd",
  vendorCode: mockSupplierProfile.vendorCode || "VEND-NANO-7701",
  taxId: mockSupplierProfile.taxId || "VAT-LK-9948201",
  contactPerson: mockSupplierProfile.contactPerson || "Ruwan Wijesinghe",
  email: mockSupplierProfile.email || "ruwan.distro@nanotek.lk",
  phone: mockSupplierProfile.phone || "+94 11 234 5678",
  street: "No. 120/4, Baseline Road",
  city: "Colombo 09",
  postalCode: "00900",
  contractStatus: mockSupplierProfile.contractStatus || "Active Authorized Distributor",
  bankName: mockSupplierProfile.bankAccount?.bankName || "Commercial Bank of Ceylon",
  bankBranch: mockSupplierProfile.bankAccount?.branch || "Borella Branch",
  bankAccountNo: mockSupplierProfile.bankAccount?.accountNo || "8002938472",
  authorizedBrands: mockSupplierProfile.authorizedBrands || [
    "ASUS ROG",
    "MSI Gaming",
    "Corsair",
    "G.Skill",
    "DeepCool",
    "Lian Li",
  ],
  avatarUrl: "",
};

export const SUPPLIER_PROFILE_STORAGE_KEY = "technova_supplier_profile";

export function getStoredSupplierProfile(): SupplierProfileData {
  if (typeof window === "undefined") return DEFAULT_SUPPLIER_PROFILE;
  try {
    const raw = localStorage.getItem(SUPPLIER_PROFILE_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SUPPLIER_PROFILE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn("Failed to load supplier profile from localStorage:", e);
  }
  return DEFAULT_SUPPLIER_PROFILE;
}

export function saveStoredSupplierProfile(data: SupplierProfileData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SUPPLIER_PROFILE_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(
      new CustomEvent("supplier_profile_updated", { detail: data })
    );
  } catch (e) {
    console.warn("Failed to save supplier profile to localStorage:", e);
  }
}

interface SupplierProfileProps {
  onProfileUpdate?: (profile: SupplierProfileData) => void;
}

export default function SupplierProfile({ onProfileUpdate }: SupplierProfileProps) {
  const [profile, setProfile] = useState<SupplierProfileData>(DEFAULT_SUPPLIER_PROFILE);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [isSaving, setIsSaving] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordToast, setPasswordToast] = useState("");
  const [passwordToastType, setPasswordToastType] = useState<"success" | "error">("success");
  const [showPasswords, setShowPasswords] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = getStoredSupplierProfile();
    setProfile(stored);
    setAvatarPreview(stored.avatarUrl);
  }, []);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4000);
  }

  function showPassToast(msg: string, type: "success" | "error" = "success") {
    setPasswordToast(msg);
    setPasswordToastType(type);
    setTimeout(() => setPasswordToast(""), 4000);
  }

  // Handle Photo File Upload
  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please choose a valid image file (PNG, JPG, WEBP).", "error");
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      showToast("Selected image is too large. Please select a photo below 5MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAvatarPreview(result);
      setProfile((prev) => ({ ...prev, avatarUrl: result }));
      showToast("Company logo / avatar preview updated! Click 'Save Profile Details' to keep changes.");
    };
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    setAvatarPreview("");
    setProfile((prev) => ({ ...prev, avatarUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    showToast("Profile avatar removed. Corporate initials will be used.");
  }

  // Handle Profile Details Save
  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile.companyName.trim()) {
      showToast("Please enter a valid company name.", "error");
      return;
    }

    if (!profile.contactPerson.trim()) {
      showToast("Please enter a valid contact liaison name.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      showToast("Please enter a valid official email address.", "error");
      return;
    }

    setIsSaving(true);
    const updated: SupplierProfileData = {
      ...profile,
      companyName: profile.companyName.trim(),
      contactPerson: profile.contactPerson.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      street: profile.street.trim(),
      city: profile.city.trim(),
      postalCode: profile.postalCode.trim(),
      bankName: profile.bankName.trim(),
      bankBranch: profile.bankBranch.trim(),
      bankAccountNo: profile.bankAccountNo.trim(),
      avatarUrl: avatarPreview,
    };

    saveStoredSupplierProfile(updated);
    setProfile(updated);
    onProfileUpdate?.(updated);

    setTimeout(() => {
      setIsSaving(false);
      showToast("Supplier corporate profile details and logo saved successfully!");
    }, 400);
  }

  // Handle Security Password Update
  function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword) {
      showPassToast("Please enter your current account password.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showPassToast("New password must be at least 6 characters long.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showPassToast("New password and confirm password do not match.", "error");
      return;
    }

    showPassToast("Distributor account security credentials updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  function getInitials(nameStr: string): string {
    const parts = nameStr.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (nameStr.slice(0, 2) || "ND").toUpperCase();
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
     
      {toastMessage && (
        <div
          className={`rounded-2xl border p-4 text-xs font-bold transition-all ${
            toastType === "success"
              ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
              : "border-rose-500/40 bg-rose-950/40 text-rose-300"
          }`}
        >
          {toastType === "success" ? "✓" : "⚠"} {toastMessage}
        </div>
      )}

      {/* Main Grid: Left = Photo & Vendor Meta, Right = Editable Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Avatar & Summary (cols 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl text-center space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Corporate Branding / Avatar
            </h2>

            {/* Avatar Circle */}
            <div className="relative mx-auto h-28 w-28 rounded-3xl overflow-hidden border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20 bg-slate-800 flex items-center justify-center group">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={profile.companyName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-3xl font-black text-white">
                  {getInitials(profile.companyName)}
                </div>
              )}

              {/* Overlay on hover */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold text-white gap-1 cursor-pointer"
                title="Change Logo / Photo"
              >
                <span>📷</span>
                <span>Change</span>
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{profile.companyName}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Rep: {profile.contactPerson}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 px-3 py-1 text-[11px] font-bold text-emerald-400">
                ● Active Hardware Distributor
              </div>
            </div>

            {/* Photo Action Buttons */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              accept="image/*"
              className="hidden"
            />

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all"
              >
                <span>📸</span>
                <span>Upload Corporate Logo</span>
              </button>

              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="w-full rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-all"
                >
                  Remove Logo
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Editable Profile & Security Forms (cols 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Form 1: General Commercial & Contact Details */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-5">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base font-extrabold text-white">Commercial & Contact Details</h2>
              <p className="text-xs text-slate-400">Update your company legal name, contact liaison, email, and warehouse location</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Company Registered Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.companyName}
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                    placeholder="e.g. Nanotek Distribution (Pvt) Ltd"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Commercial Liaison / Contact Person <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.contactPerson}
                    onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                    placeholder="e.g. Ruwan Wijesinghe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Official Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                    placeholder="vendor@company.lk"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Hotline / Mobile Phone <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                    placeholder="+94 11 234 5678"
                  />
                </div>
              </div>

              {/* Warehouse Address */}
              <div className="pt-2 border-t border-white/5 space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Warehouse & Central Dispatch Address
                </span>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Street Address</label>
                  <input
                    type="text"
                    value={profile.street}
                    onChange={(e) => setProfile({ ...profile, street: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                    placeholder="e.g. No. 120/4, Baseline Road"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">City</label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                      placeholder="e.g. Colombo 09"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Postal Code</label>
                    <input
                      type="text"
                      value={profile.postalCode}
                      onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                      placeholder="e.g. 00900"
                    />
                  </div>
                </div>
              </div>

              {/* Payout Banking Details */}
              <div className="pt-2 border-t border-white/5 space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Direct Bank Settlement Account
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Bank Name</label>
                    <input
                      type="text"
                      value={profile.bankName}
                      onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                      placeholder="e.g. Commercial Bank"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Branch</label>
                    <input
                      type="text"
                      value={profile.bankBranch}
                      onChange={(e) => setProfile({ ...profile, bankBranch: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                      placeholder="e.g. Borella Branch"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Account Number</label>
                    <input
                      type="text"
                      value={profile.bankAccountNo}
                      onChange={(e) => setProfile({ ...profile, bankAccountNo: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                      placeholder="e.g. 8002938472"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Profile Details"}
                </button>
              </div>
            </form>
          </div>

          {/* Form 2: Security & Password Update */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-5">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base font-extrabold text-white">Distributor Account Security</h2>
              <p className="text-xs text-slate-400">Update your distributor portal login password or verification PIN</p>
            </div>

            {passwordToast && (
              <div
                className={`rounded-2xl border p-4 text-xs font-bold transition-all ${
                  passwordToastType === "success"
                    ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                    : "border-rose-500/40 bg-rose-950/40 text-rose-300"
                }`}
              >
                {passwordToastType === "success" ? "✓" : "⚠"} {passwordToast}
              </div>
            )}

            <form onSubmit={handleSavePassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Current Password <span className="text-rose-400">*</span>
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none font-mono"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    New Password <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none font-mono"
                    placeholder="Min 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    Confirm New Password <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none font-mono"
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showPasswords}
                    onChange={(e) => setShowPasswords(e.target.checked)}
                    className="rounded border-white/20 bg-slate-950 text-blue-600 focus:ring-0"
                  />
                  <span>Show password characters</span>
                </label>

                <button
                  type="submit"
                  className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-5 py-2.5 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white active:scale-95 transition-all"
                >
                  Update Security Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
