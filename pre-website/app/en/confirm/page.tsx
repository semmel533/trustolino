import { Suspense } from "react";
import type { Metadata } from "next";
import ConfirmationView from "@/components/ui/ConfirmationView";

export const metadata: Metadata = {
  title: "Confirm Email | Trustolino",
  description: "Confirm your email address for the Trustolino waitlist.",
};

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <ConfirmationView locale="en" />
    </Suspense>
  );
}
