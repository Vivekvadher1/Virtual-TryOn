import Link from "next/link";
import CurrentYear from "@/components/common/CurrentYear";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* BRAND */}
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            VIRTUAL<span>AI</span>
          </Link>

          <p>
            Experience fashion differently with AI-powered virtual try-on.
            Discover your style and explore fashion with greater confidence.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link href="/">Home</Link>
          <Link href="/explore">Explore Collection</Link>
          <Link href="/about">About Us</Link>
          <Link href="/wishlist">Wishlist</Link>
        </div>

        {/* ACCOUNT */}
        <div className="footer-links">
          <h3>Your Account</h3>

          <Link href="/login">Login</Link>
          <Link href="/wishlist">Saved Items</Link>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        <p>
          © <CurrentYear /> Virtual AI Try-On Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
