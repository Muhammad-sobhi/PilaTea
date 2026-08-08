"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/Loading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getMemberships, purchaseMembership } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { getSetting } from "@/lib/utils";
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
    getMemberships<Plan[]>()
      .then((r) => setPlans(r || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const s = (key: string, fallback: string) => getSetting(settings, key, fallback);

  const handlePurchase = async (plan: Plan) => {
    if (!user) {
      router.push("/login?redirect=/memberships");
      return;
    }
    setPurchasing(plan.id);
    setMessage(null);
    try {
      await purchaseMembership(plan.id);
      setMessage({
        type: "success",
        text: "Successfully subscribed to " + plan.name + "! Welcome aboard.",
      });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Purchase failed",
      });
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) return <Loading text="Loading membership plans..." />;

  // Default plans matching member.png mockup if database empty
  const defaultPlans: Plan[] = [
    {
      id: 1,
      name: "Stretch Starter",
      description: "Perfect for beginners. 4 Pilates sessions per month.",
      price: 79.0,
      popular: false,
      features: [
        "4 Pilates sessions/month",
        "Free tea at every visit",
        "10% off merchandise",
        "Access to member events",
      ],
    },
    {
      id: 2,
      name: "Flow Membership",
      description: "Our most popular plan. 8 sessions + unlimited tea.",
      price: 149.0,
      popular: true,
      badge_text: "MOST POPULAR",
      features: [
        "8 Pilates sessions/month",
        "Unlimited tea bar access",
        "15% off merchandise",
        "Priority booking",
        "Exclusive member events",
        "Free guest pass (1/month)",
      ],
    },
    {
      id: 3,
      name: "VIP Wellness Pass",
      description: "Unlimited everything. The ultimate wellness experience.",
      price: 299.0,
      popular: false,
      features: [
        "Unlimited Pilates sessions",
        "Unlimited tea bar + to-go",
        "20% off all merchandise",
        "VIP event access",
        "Private session (2/month)",
        "Guest passes (4/month)",
        "Monthly wellness box",
      ],
    },
  ];

  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  return (
    <div className="relative min-h-screen pt-24 pb-32 md:pb-40 mb-12">
      {/* Full-width Hero Section with /member.png covering full width */}
      <div className="relative w-full min-h-[500px] md:min-h-[580px] overflow-hidden flex items-start pt-12 pb-28 md:pb-36 border-b border-[#EBE3D5] shadow-sm">
        {/* Background Image member.png */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/member.png"
            alt="PILATEA Studio Memberships"
            fill
            className="object-cover object-center brightness-[0.98]"
            priority
          />
          {/* Soft gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F2E9]/95 via-[#F7F2E9]/75 to-transparent md:w-[65%]" />
        </div>

        {/* Hero Content inside max-w container */}
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 w-full relative z-10">
          <BackButton />

          <ScrollReveal>
            <div className="mt-4 max-w-xl text-[#4A354F]">
              <p className="font-script text-3xl md:text-4xl text-[#5B1D2E] mb-2 leading-snug">
                {s("membership_heading", "Choose Your Path")}
              </p>

              <h1
                className="font-script text-5xl md:text-6xl lg:text-7xl text-[#5B1D2E] mb-4 leading-tight"
                style={{
                  background: "none",
                  WebkitBackgroundClip: "unset",
                  WebkitTextFillColor: "initial",
                  color: "#5B1D2E",
                }}
              >
                Membership Plans
              </h1>

              <p className="text-sm md:text-base text-[#5C4D56] leading-relaxed mb-8 max-w-md">
                Flexible plans designed to support your wellness journey — on the mat and in life.
              </p>

              {/* Monthly / Annual Toggle Switch */}
              <div className="inline-flex bg-[#EFE8DC]/90 backdrop-blur-md p-1.5 rounded-full border border-[#E4DAC9] shadow-inner items-center gap-1">
                <button
                  onClick={() => setBilling("monthly")}
                  className={`px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                    billing === "monthly"
                      ? "bg-[#5B1D2E] text-white shadow-md"
                      : "text-[#5C4D56] hover:text-[#5B1D2E]"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling("annual")}
                  className={`px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 ${
                    billing === "annual"
                      ? "bg-[#5B1D2E] text-white shadow-md"
                      : "text-[#5C4D56] hover:text-[#5B1D2E]"
                  }`}
                >
                  <span>Annual</span>
                  <span className="bg-[#6B8E68] text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    Save ~15%
                  </span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8">
        {/* Feedback notification message */}
        {message && (
          <div
            className={`max-w-md mx-auto my-6 px-5 py-3 rounded-2xl text-center text-sm font-medium shadow-sm ${
              message.type === "success"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                : "bg-rose-100 text-rose-800 border border-rose-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Floating Cards overlapping bottom of full-width background image without outer containing section */}
        <div className="relative z-20 -mt-20 md:-mt-28">
          {/* 3 Tier Membership Cards directly floating over bottom of background image */}
          <ScrollReveal>
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-stretch mb-16">
              {displayPlans.map((plan) => {
                const rawPrice = typeof plan.price === "string" ? parseFloat(plan.price) : Number(plan.price) || 0;
                const displayPrice = billing === "monthly" ? rawPrice : rawPrice * 0.85;

                return (
                  <div
                    key={plan.id}
                    className={`relative bg-[#F7F2E9]/80 backdrop-blur-xl rounded-[28px] p-8 border ${
                      plan.popular
                        ? "border-[#5B1D2E] shadow-2xl ring-2 ring-[#5B1D2E]/30 bg-[#F7F2E9]/90"
                        : "border-[#EBE3D5]/80 shadow-xl"
                    } flex flex-col justify-between transition-all duration-300 hover:-translate-y-1`}
                  >
                  {/* Most Popular Ribbon Ribbon Badge for center card */}
                  {plan.popular && (
                    <div className="absolute top-0 right-0 overflow-hidden w-28 h-28 rounded-tr-[28px] pointer-events-none">
                      <div className="absolute top-5 -right-7 rotate-45 bg-[#5B1D2E] text-white text-[9px] font-bold tracking-wider py-1 w-32 text-center uppercase shadow-md">
                        {plan.badge_text || "MOST POPULAR"}
                      </div>
                    </div>
                  )}

                  <div>
                    {/* Circle Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="w-14 h-14 rounded-full bg-[#EFE8DC] border border-[#E4DAC9] flex items-center justify-center text-2xl text-[#5B1D2E]">
                        {plan.id === 1 ? "🧘" : plan.id === 2 ? "🌸" : "🍵"}
                      </div>
                    </div>

                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <h3 className="font-bold text-xl md:text-2xl text-[#4A354F] mb-2">
                        {plan.name}
                      </h3>
                      {plan.description && (
                        <p className="text-xs md:text-sm text-[#6A5A64] max-w-xs mx-auto leading-relaxed">
                          {plan.description}
                        </p>
                      )}
                    </div>

                    {/* Price Block */}
                    <div className="text-center mb-8 pb-6 border-b border-[#E8DFCFA0]/60">
                      <div className="flex items-baseline justify-center gap-1 text-[#5B1D2E]">
                        <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                          ${displayPrice.toFixed(2)}
                        </span>
                        <span className="text-xs md:text-sm text-[#6A5A64] font-medium">
                          /month
                        </span>
                      </div>
                      {billing === "annual" && (
                        <p className="text-[11px] text-[#7A6872] mt-1 font-medium">
                          Billed annually (${(displayPrice * 12).toFixed(2)}/yr)
                        </p>
                      )}
                    </div>

                    {/* Features List with Checklist Checkmarks */}
                    <ul className="space-y-3.5 mb-8 text-xs md:text-sm text-[#5C4D56]">
                      {(plan.features || []).map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#E8DFCFA0] flex items-center justify-center text-[#5B1D2E] text-xs shrink-0 font-bold">
                            ✓
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Get Started Button */}
                  <button
                    onClick={() => handlePurchase(plan)}
                    disabled={purchasing === plan.id}
                    className={`w-full py-3.5 rounded-full text-xs md:text-sm font-semibold transition-all shadow-md active:scale-95 ${
                      purchasing === plan.id
                        ? "opacity-50 cursor-not-allowed bg-gray-400 text-white"
                        : plan.popular
                        ? "bg-[#5B1D2E] hover:bg-[#481523] text-white"
                        : "bg-[#5B1D2E] hover:bg-[#481523] text-white"
                    }`}
                  >
                    {purchasing === plan.id ? "Processing..." : "Get Started"}
                  </button>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* 5 Bottom Feature Pillars Bar matching member.png mockup */}
        <ScrollReveal>
          <div className="bg-[#F7F2E9]/75 backdrop-blur-xl rounded-[28px] p-6 md:p-8 border border-[#EBE3D5]/80 shadow-lg grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {/* Pillar 1 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#EFE8DC] border border-[#E4DAC9] flex items-center justify-center mb-3 text-[#5B1D2E] text-xl">
                🧘‍♂️
              </div>
              <h4 className="font-semibold text-xs md:text-sm text-[#4A354F] mb-1">
                Expert Instructors
              </h4>
              <p className="text-[11px] text-[#7A6872] leading-tight max-w-[140px]">
                Guidance from certified Pilates experts.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#EFE8DC] border border-[#E4DAC9] flex items-center justify-center mb-3 text-[#5B1D2E] text-xl">
                🍵
              </div>
              <h4 className="font-semibold text-xs md:text-sm text-[#4A354F] mb-1">
                Tea Included
              </h4>
              <p className="text-[11px] text-[#7A6872] leading-tight max-w-[140px]">
                Enjoy premium tea at every visit.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#EFE8DC] border border-[#E4DAC9] flex items-center justify-center mb-3 text-[#5B1D2E] text-xl">
                📅
              </div>
              <h4 className="font-semibold text-xs md:text-sm text-[#4A354F] mb-1">
                Flexible Booking
              </h4>
              <p className="text-[11px] text-[#7A6872] leading-tight max-w-[140px]">
                Book sessions easily around your schedule.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#EFE8DC] border border-[#E4DAC9] flex items-center justify-center mb-3 text-[#5B1D2E] text-xl">
                🎁
              </div>
              <h4 className="font-semibold text-xs md:text-sm text-[#4A354F] mb-1">
                Member Perks
              </h4>
              <p className="text-[11px] text-[#7A6872] leading-tight max-w-[140px]">
                Exclusive discounts and special offers.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="flex flex-col items-center col-span-2 md:col-span-1">
              <div className="w-12 h-12 rounded-full bg-[#EFE8DC] border border-[#E4DAC9] flex items-center justify-center mb-3 text-[#5B1D2E] text-xl">
                👥
              </div>
              <h4 className="font-semibold text-xs md:text-sm text-[#4A354F] mb-1">
                Community Access
              </h4>
              <p className="text-[11px] text-[#7A6872] leading-tight max-w-[140px]">
                Join events and connect with our community.
              </p>
            </div>
          </div>
        </ScrollReveal>
        </div>
      </div>
    </div>
  );
}