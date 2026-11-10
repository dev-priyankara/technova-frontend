"use client";

import React, { useEffect, useState } from "react";
import {
  apiFetch,
  updateCustomerProfile,
  updateCustomerPassword,
} from "@/lib/auth";

export default function SettingsSection() {
  const [profileForm, setProfileForm] = useState({
    name: "Kasun Perera",
    email: "kasun.perera@example.lk",
    phone: "+94 77 123 4567",
    street: "No. 42, Galle Road",
    city: "Bambalapitiya, Colombo 04",
    postalCode: "00400",
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [profileErrorMsg, setProfileErrorMsg] = useState("");
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    let active = true;
    apiFetch<{
      name: string;
      email: string;
      phone: string;
      street: string;
      city: string;
      postal_code: string;
    }>("/auth/profile")
      .then((profile) => {
        if (!active) return;
        setProfileForm({
          name: profile.name,
          email: profile.email,
          phone: profile.phone || "",
          street: profile.street || "",
          city: profile.city || "",
          postalCode: profile.postal_code || "",
        });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setProfileErrorMsg(
          error instanceof Error ? error.message : "Failed to load your profile.",
        );
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg("");

    try {
      await updateCustomerProfile({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        street: profileForm.street,
        city: profileForm.city,
        postal_code: profileForm.postalCode,
      });
      setProfileSuccessMsg("Profile details updated successfully in database!");
      setTimeout(() => setProfileSuccessMsg(""), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordErrorMsg("");
    setPasswordSuccessMsg("");

    if (passwordForm.newPassword.length < 8) {
      setPasswordErrorMsg("New password must be at least 8 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErrorMsg("New password and confirmation do not match.");
      return;
    }

    setIsSavingPassword(true);
    try {
      await updateCustomerPassword({
        new_password: passwordForm.newPassword,
        confirm_password: passwordForm.confirmPassword,
      });
      setPasswordSuccessMsg("Password changed successfully in database!");
      setPasswordForm({
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordSuccessMsg(""), 4000);
    } catch (err) {
      setPasswordErrorMsg(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-blue-300">
          ⚙️ Account Preferences
        </span>
        <h2 className="mt-2 text-xl sm:text-2xl font-black text-white">Account Settings</h2>
        <p className="mt-1 text-xs text-slate-300">
          Update your contact information, delivery address, and login credentials for TECHNOVA Computers.
        </p>
      </div>

      {profileErrorMsg && (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {profileErrorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Form 1: Personal Details & Shipping Address */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl">
          <div className="border-b border-white/10 pb-3 sm:pb-4">
            <h3 className="text-sm sm:text-base font-extrabold text-white">Personal & Delivery Details</h3>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Used as the default shipping address on your hardware purchases.
            </p>
          </div>

          {profileSuccessMsg && (
            <div className="mt-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400">
              ✓ {profileSuccessMsg}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* Street Address */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Delivery Street Address
              </label>
              <input
                type="text"
                value={profileForm.street}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, street: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* City & Postal Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  City / Town
                </label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, city: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={profileForm.postalCode}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, postalCode: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full rounded-xl bg-white py-2.5 sm:py-3 text-xs font-bold !text-black shadow-lg transition-transform hover:bg-blue-50 active:scale-95 disabled:opacity-50"
              >
                {isSavingProfile ? "Saving Details..." : "Save Personal Details"}
              </button>
            </div>
          </form>
        </div>

        {/* Form 2: Password Change */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl">
          <div className="border-b border-white/10 pb-3 sm:pb-4">
            <h3 className="text-sm sm:text-base font-extrabold text-white">Security & Password</h3>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Ensure your account is protected with a secure password.
            </p>
          </div>

          {passwordSuccessMsg && (
            <div className="mt-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400">
              ✓ {passwordSuccessMsg}
            </div>
          )}

          {passwordErrorMsg && (
            <div className="mt-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-300">
              ⚠️ {passwordErrorMsg}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs">
            {/* New Password */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                  placeholder="At least 8 characters"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 pr-10 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-white"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    {showNewPassword ? (
                      <>
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                        <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.1 2.1-2.1 3.1" />
                        <path d="M6.2 6.2C3.9 7.6 2.6 9.8 2.5 12c.5 1.2 1.8 3.1 4.1 4.7A9.8 9.8 0 0012 19c1.1 0 2.1-.2 3-.5" />
                      </>
                    ) : (
                      <>
                        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                  placeholder="Repeat new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 pr-10 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-white"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    {showConfirmPassword ? (
                      <>
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                        <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.1 2.1-2.1 3.1" />
                        <path d="M6.2 6.2C3.9 7.6 2.6 9.8 2.5 12c.5 1.2 1.8 3.1 4.1 4.7A9.8 9.8 0 0012 19c1.1 0 2.1-.2 3-.5" />
                      </>
                    ) : (
                      <>
                        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Password hint info */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 sm:p-3 text-[10px] sm:text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Security Recommendation:</span>
              <p className="mt-0.5">
                Use a mixture of uppercase, lowercase letters, numbers, and symbols to keep your hardware orders secure.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingPassword}
                className="w-full rounded-xl border border-blue-500/40 bg-blue-600 py-2.5 sm:py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50"
              >
                {isSavingPassword ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
