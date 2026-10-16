import { EmailVerificationForm } from "@/components/email-verification-form";
import { Footer, Header } from "@/components/site-chrome";

export default function VerifyEmailPage() {
  return <><Header /><main className="page shell"><EmailVerificationForm /></main><Footer /></>;
}
