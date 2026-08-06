"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      <div ref={navRef} className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="brand flex items-center shrink-0">
          <img
            src={scrolled ? "/logo-cream.png" : "/logo.png"}
            alt="PILATEA"
            className="h-9 sm:h-10 w-auto object-contain transition-opacity duration-300"
          />
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
            <Link href="/login" className="btn-sm">Sign In</Link>
          )}
        </div>
      </div>

      <button
        className="floating-mobile-btn"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <div className={`mobile-backdrop ${open ? "open" : ""}`} onClick={() => setOpen(false)} />
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <button
          className="mobile-menu-close"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
        <div className="mobile-nav-section">
          <Link href="/" aria-current={isActive("/") ? "page" : undefined} onClick={() => setOpen(false)}>Home</Link>
          <Link href="/about" aria-current={isActive("/about") ? "page" : undefined} onClick={() => setOpen(false)}>About</Link>
          <Link href="/pilates-on-the-go" aria-current={isActive("/pilates-on-the-go") ? "page" : undefined} onClick={() => setOpen(false)}>Pilates on the Go</Link>
          <Link href="/tea-experience" aria-current={isActive("/tea-experience") ? "page" : undefined} onClick={() => setOpen(false)}>Tea Experience</Link>
          <Link href="/events" aria-current={isActive("/events") ? "page" : undefined} onClick={() => setOpen(false)}>Events</Link>
          <Link href="/memberships" aria-current={isActive("/memberships") ? "page" : undefined} onClick={() => setOpen(false)}>Memberships</Link>
          <Link href="/gallery" aria-current={isActive("/gallery") ? "page" : undefined} onClick={() => setOpen(false)}>Gallery</Link>
          <Link href="/contact" aria-current={isActive("/contact") ? "page" : undefined} onClick={() => setOpen(false)}>Contact</Link>
          <Link href="/faq" aria-current={isActive("/faq") ? "page" : undefined} onClick={() => setOpen(false)}>FAQ</Link>
        </div>

        <div className="mobile-divider" />

        <div className="mobile-cta-section">
          {user ? (
            <>
              <Link href="/account" className="block w-full text-center">My Account</Link>
              <button onClick={logout} className="btn w-full">Logout</button>
            </>
          ) : (
            <Link href="/login" className="btn w-full">Sign In</Link>
          )}
        </div>
      </div>
    </>
  );
}