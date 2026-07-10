"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <div ref={navRef} className="navbar">
      <Link href="/" className="brand">
        <img src="/logo.png" alt="PILATEA" width="40" height="40" className="h-10 w-auto object-contain" />
        PILATEA
      </Link>

      <div className="nav-links">
        <Link href="/" aria-current={isActive("/") ? "page" : undefined}>Home</Link>
        <Link href="/about" aria-current={isActive("/about") ? "page" : undefined}>About</Link>
        <Link href="/pilates-on-the-go" aria-current={isActive("/pilates-on-the-go") ? "page" : undefined}>Pilates on the Go</Link>
        <Link href="/tea-experience" aria-current={isActive("/tea-experience") ? "page" : undefined}>Tea Experience</Link>
        <Link href="/events" aria-current={isActive("/events") ? "page" : undefined}>Events</Link>
        <Link href="/memberships" aria-current={isActive("/memberships") ? "page" : undefined}>Memberships</Link>
        <Link href="/contact" aria-current={isActive("/contact") ? "page" : undefined}>Contact</Link>
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <Link href="/account" className="btn-ghost-sm">My Account</Link>
            <button onClick={logout} className="btn-ghost-sm">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn-ghost-sm">Sign In</Link>
            <Link href="/register" className="btn-sm">Sign Up</Link>
          </>
        )}
        <Link href="/events" className="btn-sm">Book a Session</Link>
      </div>

      <button
        className="mobile-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? "✕" : "☰"}
      </button>

      <div className={`mobile-backdrop ${open ? "open" : ""}`} onClick={() => setOpen(false)} />
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <div className="mobile-nav-section">
          <Link href="/" aria-current={isActive("/") ? "page" : undefined}>Home</Link>
          <Link href="/about" aria-current={isActive("/about") ? "page" : undefined}>About</Link>
          <Link href="/pilates-on-the-go" aria-current={isActive("/pilates-on-the-go") ? "page" : undefined}>Pilates on the Go</Link>
          <Link href="/tea-experience" aria-current={isActive("/tea-experience") ? "page" : undefined}>Tea Experience</Link>
          <Link href="/events" aria-current={isActive("/events") ? "page" : undefined}>Events</Link>
          <Link href="/memberships" aria-current={isActive("/memberships") ? "page" : undefined}>Memberships</Link>
          <Link href="/gallery" aria-current={isActive("/gallery") ? "page" : undefined}>Gallery</Link>
          <Link href="/contact" aria-current={isActive("/contact") ? "page" : undefined}>Contact</Link>
          <Link href="/faq" aria-current={isActive("/faq") ? "page" : undefined}>FAQ</Link>
        </div>

        <div className="mobile-divider" />

        <div className="mobile-cta-section">
          {user ? (
            <>
              <Link href="/account" className="block w-full text-center">My Account</Link>
              <button onClick={logout} className="btn w-full">Logout</button>
            </>
          ) : (
            <>
              <Link href="/register" className="btn w-full">Sign Up</Link>
              <Link href="/login" className="btn-ghost w-full">Sign In</Link>
            </>
          )}
          <Link href="/events" className="btn w-full">Book a Session</Link>
        </div>
      </div>
    </div>
  );
}