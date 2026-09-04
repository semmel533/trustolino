import { Suspense } from "react";
import type { Metadata } from "next";
import ConfirmationView from "@/components/ui/ConfirmationView";

export const metadata: Metadata = {
  title: "E-Mail bestätigen | Trustolino",
  description: "Bestätige deine E-Mail-Adresse für die Trustolino-Warteliste.",
};

export default function BestaetigungPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <ConfirmationView locale="de" />
    </Suspense>
  );
}
