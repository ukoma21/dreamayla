import type { Metadata } from "next";
import { Footer, Header } from "@/components/site-chrome";
import { PasswordResetRequestForm } from "@/components/password-reset-request-form";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <><Header /><main className="page shell"><PasswordResetRequestForm /></main><Footer /></>;
}
