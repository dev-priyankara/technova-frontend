
"use client";

import emailjs from "@emailjs/browser";

export interface VerificationCodeData {
  to_email: string;
  name: string;
  verification_code: string;
}

export async function sendVerificationEmail(
  data: VerificationCodeData
): Promise<void> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EmailJS environment variables are missing.");
  }

  const recipientEmail = data.to_email?.trim();
  const recipientName = data.name?.trim() || "Customer";
  const code = data.verification_code?.trim();

  if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    throw new Error("Please enter a valid recipient email address.");
  }

  if (!code) {
    throw new Error("Verification code is missing.");
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
