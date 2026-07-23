"use client";

export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: "#FAF5F6" }}
    >
      {/* Large aurora gradients: mauve, plum, blush, cream (soft opacity) */}
      <div
        className="absolute -left-[10%] -top-[10%] h-[60vw] w-[60vw] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(182,124,162,0.10) 0%, transparent 60%)",
          animation: "aurora-drift 45s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[-10%] top-[5%] h-[55vw] w-[55vw] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(155,98,145,0.09) 0%, transparent 60%)",
          animation: "aurora-drift 45s ease-in-out infinite reverse",
          animationDelay: "-12s",
        }}
      />
      <div
        className="absolute bottom-[-15%] left-[20%] h-[60vw] w-[60vw] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(201,125,179,0.08) 0%, transparent 60%)",
          animation: "holo-drift 45s ease-in-out infinite",
          animationDelay: "-24s",
        }}
      />
      <div
        className="absolute left-[30%] top-[35%] h-[45vw] w-[45vw] rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 65%)",
          animation: "aurora-drift 45s ease-in-out infinite",
          animationDelay: "-33s",
        }}
      />

      {/* Holographic subtle reflections (slowly moving) */}
      <div
        className="absolute left-1/2 top-1/2 h-[80vw] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] opacity-50"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(182,124,162,0.07), rgba(155,98,145,0.07), rgba(201,125,179,0.07), rgba(250,245,246,0.07), rgba(182,124,162,0.07))",
          animation: "holo-drift 45s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[5%] bottom-[10%] h-[35vw] w-[35vw] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(201,125,179,0.07) 0%, rgba(182,124,162,0.05) 45%, transparent 70%)",
          animation: "aurora-drift 45s ease-in-out infinite reverse",
          animationDelay: "-18s",
        }}
      />
    </div>
  );
}
