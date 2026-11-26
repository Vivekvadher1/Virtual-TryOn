import Link from "next/link";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { RiGeminiFill } from "react-icons/ri";

export default function ProductNotFound() {
  return (
    <main className="product-not-found-page">
      <div className="product-not-found-container">
        {/* 404 VISUAL */}
        <div className="not-found-visual">
          <span className="not-found-number">404</span>
          <div className="not-found-icon">
            <RiGeminiFill />
          </div>
        </div>

        {/* MESSAGE */}
        <span className="not-found-label">OOPS! WRONG TURN</span>

        <h1>Page Not Found</h1>

        <p>
          Looks like this piece has gone out of style! The product you're
          looking for may have been removed, or the link might be incorrect.
        </p>

        {/* ACTIONS */}
        <div className="not-found-actions">
          <Link href="/explore" className="not-found-explore-btn">
            Explore Collection
            <span>
              <MdOutlineDoubleArrow />
            </span>
          </Link>

          <Link href="/" className="not-found-home-btn">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
