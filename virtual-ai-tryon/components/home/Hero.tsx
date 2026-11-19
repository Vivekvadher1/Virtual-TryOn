import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-label">AI-POWERED FASHION EXPERIENCE</p>

        <h1>
          Try Before You Buy.
          <br />
          <span>Virtually.</span>
        </h1>

        <p className="hero-description">
          Discover a smarter way to explore fashion. Upload your photo, choose
          your favorite outfit, and see how it looks on you with AI.
        </p>

        <div className="hero-buttons">
          <button>Start Your Try-On</button>
          <button>Explore Collection</button>
        </div>
      </div>

      <div className="hero-image">
        <Image
          src="/images/Hero.png"
          alt="Fashion model wearing a stylish outfit"
          width={600}
          height={700}
          priority
        />
      </div>
    </section>
  );
}
