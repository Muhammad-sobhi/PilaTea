"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AuroraBackground />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </SettingsProvider>
    </AuthProvider>
  );
}