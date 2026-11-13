
"use client";

import emailjs from "@emailjs/browser";

export interface VerificationCodeData {
  to_email: string;
  name: string;
  verification_code: string;
}

export function isEmailJsConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID &&
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID &&
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
  );
}

export async function sendVerificationEmail(
  data: VerificationCodeData
): Promise<void> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  const recipientEmail = data.to_email?.trim();
  const recipientName = data.name?.trim() || "Customer";
  const code = data.verification_code?.trim();

  if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    throw new Error("Please enter a valid recipient email address.");
  }

  if (!code) {
    throw new Error("Verification code is missing.");
  }

  if (!serviceId || !templateId || !publicKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Email verification is not configured. Please contact the site administrator."
      );
    }
    // Local development without an EmailJS account: skip the send and let the
    // verification screen reveal the code so registration can still be tested.
    console.warn(
      `[dev] EmailJS is not configured, so no email was sent to ${recipientEmail}. Verification code: ${code}`
    );
    return;
  }

  const templateParams = {
    to_email: recipientEmail,
    to_name: recipientName,
    name: recipientName,
    verification_code: code,
    expiry_minutes: "10",
  };

  try {
    await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      { publicKey }
    );
  } catch (error) {
    const err = error as { status?: number; text?: string };

    console.error("EmailJS sending error:", err.status, err.text);

    throw new Error(
      `EmailJS failed (${err.status ?? "unknown"}): ${
        err.text ?? "Unable to send email"
      }`
    );
  }
}
