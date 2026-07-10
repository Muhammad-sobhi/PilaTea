"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getSettings } from "@/lib/api";

const SettingsContext = createContext<Record<string, string>>({});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSettings = () => {
      getSettings<Record<string, string>>().then(setSettings).catch(() => {});
    };
    fetchSettings();
    const interval = setInterval(fetchSettings, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
