import type { Metadata } from "next";
import { Footer, Header } from "@/components/site-chrome";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <><Header /><main className="page shell"><ResetPasswordForm /></main><Footer /></>;
}
