"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        VIRTUAL<span>AI</span>
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <Link href="/explore" onClick={() => setMenuOpen(false)}>
          Explore
        </Link>

        <Link href="/about" onClick={() => setMenuOpen(false)}>
          About
        </Link>

        <Link href="/wishlist" onClick={() => setMenuOpen(false)}>
          ♡ Wishlist
        </Link>

        <Link
          href="/login"
          className="mobile-login"
          onClick={() => setMenuOpen(false)}
        >
          Login
        </Link>
      </div>

      <div className="nav-actions">
        <Link href="/login" className="login-btn">
          Login
        </Link>
      </div>
    </nav>
  );
}
