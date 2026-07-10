"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { BackButton } from "@/components/BackButton";

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      router.push(redirect || "/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page min-h-screen flex flex-col items-center justify-center" style={{ paddingTop: 100 }}>
      <div className="w-full max-w-md">
        <BackButton />
        <div className="glass-card w-full p-6 sm:p-10">
          <div className="text-center mb-8">
          <img src="/logo.png" alt="PILATEA" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm opacity-60 mt-1">Join PILATEA to book sessions</p>
        </div>

        {error && <p className="mb-4 p-3 rounded-xl text-sm bg-red-50 text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Full Name</label>
            <input type="text" required value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/60 border border-white/80 outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Email</label>
            <input type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/60 border border-white/80 outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Phone</label>
            <input type="tel" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/60 border border-white/80 outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Password</label>
            <input type="password" required minLength={8} value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/60 border border-white/80 outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Confirm Password</label>
            <input type="password" required minLength={8} value={form.password_confirmation}
              onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/60 border border-white/80 outline-none" />
          </div>
          <button type="submit" disabled={submitting} className="btn w-full disabled:opacity-50">
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 opacity-60">
          Already have an account?{" "}
          <Link href={`/login${redirect ? `?redirect=${redirect}` : ""}`}
            className="text-[#E8A6F4] font-semibold hover:underline">Sign In</Link>
        </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="page min-h-screen flex items-center justify-center" style={{ paddingTop: 100 }}><p className="opacity-60">Loading...</p></div>}>
      <RegisterForm />
    </Suspense>
  );
}