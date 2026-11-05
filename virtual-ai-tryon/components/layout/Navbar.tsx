import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        VIRTUAL<span>AI</span>
      </div>

      {/* Navigation links */}
      <div className="navLinks">
        <Link href="/">Home</Link>
        <Link href="/explore">Explore</Link>
        <Link href="/about">About</Link>
      </div>

      {/* Login button */}
      <div>
        <Link href="/login" className="loginBtn">
          Login
        </Link>
      </div>
    </nav>
  );
}