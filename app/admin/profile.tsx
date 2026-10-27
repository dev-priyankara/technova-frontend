"use client";

import React, { useState, useEffect, useRef } from "react";

export interface AdminProfileData {
  name: string;
  email: string;
  phone: string;
  role: string;
  street: string;
  city: string;
  postalCode: string;
  avatarUrl: string;
}

const DEFAULT_ADMIN_PROFILE: AdminProfileData = {
  name: "Kasun Silva",
  email: "admin.kasun@technova.lk",
  phone: "+94 77 123 4567",
  role: "Super Admin (POS & Ops)",
  street: "No. 18/A, Station Road",
  city: "Colombo 03",
  postalCode: "00300",
  avatarUrl: "",
};

export const ADMIN_PROFILE_STORAGE_KEY = "technova_admin_profile";

export function getStoredAdminProfile(): AdminProfileData {
  if (typeof window === "undefined") return DEFAULT_ADMIN_PROFILE;
  try {
    const raw = localStorage.getItem(ADMIN_PROFILE_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_ADMIN_PROFILE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn("Failed to load admin profile from localStorage:", e);
  }
  return DEFAULT_ADMIN_PROFILE;
}

export function saveStoredAdminProfile(data: AdminProfileData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(
      new CustomEvent("admin_profile_updated", { detail: data })
    );
  } catch (e) {
    console.warn("Failed to save admin profile to localStorage:", e);
  }
}

interface AdminProfileProps {
  onProfileUpdate?: (profile: AdminProfileData) => void;
}

export default function AdminProfile({ onProfileUpdate }: AdminProfileProps) {
  const [profile, setProfile] = useState<AdminProfileData>(DEFAULT_ADMIN_PROFILE);
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
    const stored = getStoredAdminProfile();
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
      showToast("Profile photo preview updated! Click 'Save Profile' to keep changes.");
    };
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    setAvatarPreview("");
    setProfile((prev) => ({ ...prev, avatarUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    showToast("Profile photo removed. Initials will be used.");
  }

  // Handle Profile Details Save
  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile.name.trim()) {
      showToast("Please enter a valid full name.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    setIsSaving(true);
    const updated: AdminProfileData = {
      ...profile,
      name: profile.name.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      street: profile.street.trim(),
      city: profile.city.trim(),
      postalCode: profile.postalCode.trim(),
      avatarUrl: avatarPreview,
    };

    saveStoredAdminProfile(updated);
    setProfile(updated);
    onProfileUpdate?.(updated);

    setTimeout(() => {
      setIsSaving(false);
      showToast("Admin profile details and photo saved successfully!");
    }, 400);
  }

  // Handle Password Update
  function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword) {
      showPassToast("Please enter your current password.", "error");
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

    showPassToast("Security password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  function getInitials(nameStr: string): string {
    const parts = nameStr.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (nameStr.slice(0, 2) || "KS").toUpperCase();
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="">
        <div>
         
        </div>

        <div className="">
         
        </div>
      </div>

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

      {/* Main Grid: Left = Photo & Quick Overview, Right = Editable Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Avatar & Summary (cols 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl text-center space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Profile Avatar
            </h2>

            {/* Avatar Circle */}
            <div className="relative mx-auto h-28 w-28 rounded-3xl overflow-hidden border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20 bg-slate-800 flex items-center justify-center group">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-3xl font-black text-white">
                  {getInitials(profile.name)}
                </div>
              )}

              {/* Overlay on hover */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold text-white gap-1 cursor-pointer"
                title="Change Photo"
              >
                <span>📷</span>
                <span>Change</span>
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{profile.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{profile.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 px-3 py-1 text-[11px] font-bold text-emerald-400">
                ● Active Administrator
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
                <span>Upload Profile Photo</span>
              </button>

              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="w-full rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-all"
                >
                  Remove Photo
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Supports PNG, JPG, or WEBP (Max 5MB).
            </p>
          </div>

          {/* Quick Account Information Box */}
         
        </div>

        {/* Right Column: Profile Edit & Security Forms (cols 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Registration Profile Details */}
          <form
            onSubmit={handleSaveProfile}
            className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white">
                  Registration & Personal Information
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Update primary contact and identifying information collected during registration.
                </p>
              </div>
              <span className="text-blue-400 text-lg">✏️</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Kasun Silva"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="admin.kasun@technova.lk"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+94 77 123 4567"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  System Role
                </label>
                <input
                  type="text"
                  disabled
                  value={profile.role}
                  className="w-full rounded-xl border border-white/5 bg-slate-950/40 px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed font-semibold"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-slate-300 font-semibold mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={profile.street}
                onChange={(e) => setProfile({ ...profile, street: e.target.value })}
                placeholder="No. 18/A, Station Road"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  City / Town
                </label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  placeholder="Colombo 03"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={profile.postalCode}
                  onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                  placeholder="00300"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSaving ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </div>
          </form>

          {/* Section 2: Security & Password Update */}
          <form
            onSubmit={handleSavePassword}
            className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white">
                  Security & Password Update
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Change your administrator password to maintain secure access to the store backend.
                </p>
              </div>
              <span className="text-amber-400 text-lg">🔒</span>
            </div>

            {passwordToast && (
              <div
                className={`rounded-xl border p-3 text-xs font-semibold ${
                  passwordToastType === "success"
                    ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                    : "border-rose-500/40 bg-rose-950/40 text-rose-300"
                }`}
              >
                {passwordToastType === "success" ? "✓" : "⚠"} {passwordToast}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Current Password
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    New Password (min 6 chars)
                  </label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={showPasswords}
                    onChange={(e) => setShowPasswords(e.target.checked)}
                    className="rounded border-white/20 bg-slate-900 text-blue-600 focus:ring-0"
                  />
                  <span>Show password characters</span>
                </label>

                <button
                  type="submit"
                  className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-xs font-bold text-blue-300 hover:bg-blue-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

