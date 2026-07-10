"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/Loading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getMemberships, purchaseMembership } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { BackButton } from "@/components/BackButton";

interface Plan {
  id: number;
  name: string;
  description?: string;
  price: number;
  popular?: boolean;
  badge_text?: string;
  features?: string[];
}

export default function MembershipsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const settings = useSettings();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState("monthly");
  const [purchasing, setPurchasing] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    getMemberships<Plan[]>().then(r => setPlans(r || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const s = (key: string, fallback: string) => settings[key] || fallback;

  const handlePurchase = async (plan: Plan) => {
    if (!user) { router.push("/login?redirect=/memberships"); return; }
    setPurchasing(plan.id);
    setMessage(null);
    try {
      await purchaseMembership(plan.id);
      setMessage({ type: "success", text: "Successfully subscribed to " + plan.name + "! Welcome aboard." });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Purchase failed" });
    } finally { setPurchasing(null); }
  };

  if (loading) return <Loading text="Loading membership plans..." />;

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <BackButton />
      <ScrollReveal>
        <section className="text-center mb-16">
          <p className="script" style={{ margin: "0 0 12px" }}>{s("membership_heading", "Choose Your Path")}</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Membership Plans</h1>
          <div className="inline-flex bg-white/5 rounded-full p-1 mb-6">
            <button className={`px-6 py-2 rounded-full transition-colors ${billing === "monthly" ? "bg-white/10 font-semibold" : "opacity-60 hover:opacity-100"}`} onClick={() => setBilling("monthly")}>Monthly</button>
            <button className={`px-6 py-2 rounded-full transition-colors ${billing === "annual" ? "bg-white/10 font-semibold" : "opacity-60 hover:opacity-100"}`} onClick={() => setBilling("annual")}>Annual <span className="text-xs text-green-400">Save ~15%</span></button>
          </div>
        </section>
      </ScrollReveal>

      {message && (
        <div className={`max-w-md mx-auto mb-8 px-4 py-3 rounded-xl text-center text-sm ${message.type === "success" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
          {message.text}
        </div>
      )}

      <ScrollReveal>
        <section className="grid md:grid-cols-3 gap-6 mb-16 items-stretch">
          {plans.length === 0 && <p className="opacity-50 col-span-3 text-center py-12">No membership plans available at the moment.</p>}
          {plans.map(p => (
            <div key={p.id} className={`relative ${p.popular ? "scale-105" : ""}`}>
              {p.popular && <p className="text-center text-sm font-semibold text-[var(--color-primary)] mb-3">{p.badge_text || "Most Popular"}</p>}
              <div className={`glass-card h-full flex flex-col ${p.popular ? "ring-2 ring-[var(--color-primary)]/40" : ""}`}>
                <h3 className="text-2xl font-bold mb-1">{p.name}</h3>
                <p className="text-sm opacity-60 mb-4">{p.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold">${billing === "monthly" ? p.price : Math.round(p.price * 12 * 0.85)}</span>
                  <span className="opacity-60 text-sm">/month</span>
                  {billing === "annual" && <p className="text-xs opacity-50 mt-1">${Math.round(p.price * 12 * 0.85 * 12)}/year</p>}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {(p.features || []).map((f, i) => <li key={i} className="flex items-center gap-2 text-sm"><span className="text-green-400">&check;</span> {f}</li>)}
                </ul>
                <button onClick={() => handlePurchase(p)} disabled={purchasing === p.id}
                  className={`w-full py-3 rounded-full font-semibold transition-colors ${purchasing === p.id ? "opacity-60 cursor-not-allowed" : ""} ${p.popular ? "btn" : "bg-white/10 hover:bg-white/20"}`}>
                  {purchasing === p.id ? "Processing..." : "Get Started"}
                </button>
              </div>
            </div>
          ))}
        </section>
      </ScrollReveal>
    </div>
  );
}