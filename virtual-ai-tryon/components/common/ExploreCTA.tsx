import { IoIosArrowForward } from "react-icons/io";
export default function ExploreCTA() {
  return (
    <section className="explore-cta-section">
      <div className="explore-cta-content">
        <span className="explore-cta-label">YOUR STYLE, YOUR WAY</span>

        <h2>
          Ready to Discover
          <br />
          Your Next Favorite Look?
        </h2>

        <p>
          Explore fashion, discover your style, and experience virtual try-on in
          a whole new way.
        </p>

        <a href="/explore" className="explore-cta-button">
          Explore Collection
          <span>
            <IoIosArrowForward />
          </span>
        </a>
      </div>
    </section>
  );
}
