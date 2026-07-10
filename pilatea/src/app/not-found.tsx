import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page min-h-screen flex items-center justify-center text-center" style={{ paddingTop: 130 }}>
      <div className="max-w-lg mx-auto">
        <span className="text-8xl block mb-6" style={{ animation: "float 3s ease-in-out infinite" }}>☕</span>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl opacity-60 mb-8">This page needs a stretch break &mdash; it doesn&apos;t exist.</p>
        <div className="glass-panel p-8">
          <p className="mb-6 opacity-70">Let&apos;s guide you back to your mat.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="btn">Home</Link>
            <Link href="/events" className="btn">Book a Session</Link>
          </div>
        </div>
      </div>
    </div>
  );
}