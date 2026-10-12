"use client";

import React, { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";

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
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setProfileForm((prev) => ({
        ...prev,
        name: session.name || prev.name,
        email: session.email || prev.email,
        phone: session.phone || prev.phone,
      }));
    }
  }, []);

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg("");

    setTimeout(() => {
      setIsSavingProfile(false);
      setProfileSuccessMsg("Profile details updated successfully!");
      setTimeout(() => setProfileSuccessMsg(""), 4000);
    }, 600);
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordErrorMsg("");
    setPasswordSuccessMsg("");

    if (!passwordForm.currentPassword) {
      setPasswordErrorMsg("Please enter your current password.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErrorMsg("New password and confirmation do not match.");
      return;
    }

    setIsSavingPassword(true);

    setTimeout(() => {
      setIsSavingPassword(false);
      setPasswordSuccessMsg("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordSuccessMsg(""), 4000);
    }, 600);
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
            {/* Current Password */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="Repeat new password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
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
