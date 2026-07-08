import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [router.asPath]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <nav ref={navRef}
      className="navbar glass"
      style={{
        position: 'fixed',
        top: 18,
        left: 34,
        right: 34,
        zIndex: 50,
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 34px',
        background: scrolled ? 'rgba(255,255,255,0.82)' : 'var(--white-glass)',
        border: '1px solid var(--border-glass)',
        backdropFilter: scrolled ? 'blur(28px)' : 'blur(22px)',
        boxShadow: scrolled ? '0 12px 48px rgba(58,29,53,0.15)' : 'var(--shadow-soft)',
        borderRadius: 30,
        transition: 'all 0.3s ease',
      }}
    >
      <Link href="/" className="brand">
        <img src="/Untitled.png" alt="PILATEA" className="logo-img" />
        PILATEA
      </Link>

      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/pilates-on-the-go">Pilates on the Go</Link>
        <Link href="/tea-experience">Tea Experience</Link>
        <Link href="/events">Events</Link>
        <Link href="/memberships">Memberships</Link>
        <Link href="/contact">Contact</Link>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link href="/account" className="btn-ghost text-sm !py-2 !px-4">My Account</Link>
            <button onClick={logout} className="btn-ghost text-sm !py-2 !px-4">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn-ghost text-sm !py-2 !px-4">Sign In</Link>
            <Link href="/register" className="btn text-sm !py-2 !px-5">Sign Up</Link>
          </>
        )}
        <Link href="/events" className="btn hidden sm:inline-block">Book a Session</Link>
        <button
          className="mobile-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      <div className={`mobile-backdrop ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/pilates-on-the-go">Pilates on the Go</Link>
        <Link href="/tea-experience">Tea Experience</Link>
        <Link href="/events">Events</Link>
        <Link href="/memberships">Memberships</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/faq">FAQ</Link>
        {user ? (
          <>
            <Link href="/account" className="block px-4 py-2 text-sm font-semibold opacity-80">My Account</Link>
            <button onClick={logout} className="btn block text-center mt-2 w-full" style={{ padding: '12px 16px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn block text-center mt-2">Sign In</Link>
            <Link href="/register" className="btn-ghost block text-center">Sign Up</Link>
          </>
        )}
        <Link href="/events" className="btn" style={{ textAlign: 'center', marginTop: 8 }}>Book a Session</Link>
      </div>
    </nav>
  );
}
