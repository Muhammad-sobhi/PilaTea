"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden', position: 'relative' }}>
      <AuthProvider>
        <SettingsProvider>
          <AuroraBackground />
          <Navbar />
          <main style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>{children}</main>
          <Footer />
        </SettingsProvider>
      </AuthProvider>
    </div>
  );
}