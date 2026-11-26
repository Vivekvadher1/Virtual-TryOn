"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiNestedHearts } from "react-icons/gi";

const WISHLIST_KEY = "wishlist";
export const WISHLIST_UPDATED_EVENT = "wishlistUpdated";

function getWishlistCount(): number {
  if (typeof window === "undefined") return 0;

  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  // const [wishlistCount, setWishlistCount] = useState(0);

  // useEffect(() => {
  //   setWishlistCount(getWishlistCount());

  //   const handleSync = () => {
  //     setWishlistCount(getWishlistCount());
  //   };

  //   window.addEventListener(WISHLIST_UPDATED_EVENT, handleSync);
  //   window.addEventListener("storage", handleSync);

  //   return () => {
  //     window.removeEventListener(WISHLIST_UPDATED_EVENT, handleSync);
  //     window.removeEventListener("storage", handleSync);
  //   };
  // }, []);

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
        {menuOpen ? <IoMdClose /> : <RxHamburgerMenu />}
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
          <span className="wishlist-label">
            <GiNestedHearts className="wishlist-icon" />
            <span>Wishlist</span>
          </span>
          {/* {wishlistCount > 0 && (
            <span className="wishlist-count">{wishlistCount}</span>
          )} */}
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
