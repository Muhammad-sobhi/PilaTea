"use client";

export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Large aurora gradients: pink, lavender, blue, white (8-15% opacity) */}
      <div
        className="absolute -left-[10%] -top-[10%] h-[60vw] w-[60vw] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(232,166,244,0.14) 0%, transparent 60%)",
          animation: "aurora-drift 45s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[-10%] top-[5%] h-[55vw] w-[55vw] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(205,183,255,0.13) 0%, transparent 60%)",
          animation: "aurora-drift 45s ease-in-out infinite reverse",
          animationDelay: "-12s",
        }}
      />
      <div
        className="absolute bottom-[-15%] left-[20%] h-[60vw] w-[60vw] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(191,234,255,0.12) 0%, transparent 60%)",
          animation: "holo-drift 45s ease-in-out infinite",
          animationDelay: "-24s",
        }}
      />
      <div
        className="absolute left-[30%] top-[35%] h-[45vw] w-[45vw] rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 65%)",
          animation: "aurora-drift 45s ease-in-out infinite",
          animationDelay: "-33s",
        }}
      />

      {/* Holographic rainbow reflections (slowly moving) */}
      <div
        className="absolute left-1/2 top-1/2 h-[80vw] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] opacity-60"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(232,166,244,0.10), rgba(205,183,255,0.10), rgba(191,234,255,0.10), rgba(255,214,240,0.10), rgba(232,166,244,0.10))",
          animation: "holo-drift 45s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[5%] bottom-[10%] h-[35vw] w-[35vw] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,200,235,0.10) 0%, rgba(160,200,255,0.08) 45%, transparent 70%)",
          animation: "aurora-drift 45s ease-in-out infinite reverse",
          animationDelay: "-18s",
        }}
      />
    </div>
  );
}
