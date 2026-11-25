import ExploreCTA from "@/components/common/ExploreCTA";

export default function AboutPage() {
  return (
    <main className="about-page">
      {/* ABOUT HERO */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-label">ABOUT US</span>

          <h1>
            Redefining the Way
            <br />
            You Experience Fashion
          </h1>

          <p>
            Discover a smarter way to explore fashion with virtual try-on
            technology. Find your style, visualize your look, and shop with
            greater confidence.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="our-story-section">
        <div className="our-story-container">
          <div className="our-story-image">
            <img
              src="/images/about-fashion.png"
              alt="Fashion and personal style"
            />
          </div>

          <div className="our-story-content">
            <span className="about-label">OUR STORY</span>

            <h2>
              Fashion Should Feel
              <span> Personal.</span>
            </h2>

            <p>
              Finding the right outfit online can sometimes feel uncertain. You
              see something you love, but imagining how it will look on you
              isn't always easy.
            </p>

            <p>
              That's where our journey begins. We are building a smarter fashion
              experience that brings technology and personal style together
              through virtual try-on.
            </p>

            <p>
              Our goal is to make exploring fashion more interactive,
              convenient, and confident — helping you discover styles that feel
              right for you.
            </p>
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="our-mission-section">
        <div className="our-mission-container">
          <span className="about-label">OUR MISSION</span>

          <h2>
            Making Fashion More
            <span> Personal & Accessible</span>
          </h2>

          <p className="mission-description">
            We believe everyone deserves a more confident and enjoyable way to
            explore fashion. Our mission is to bring technology and personal
            style together.
          </p>

          <div className="mission-cards">
            <div className="mission-card">
              <div className="mission-icon">✦</div>
              <h3>Confidence</h3>
              <p>
                Make fashion choices easier by helping you visualize how outfits
                may look before making a purchase.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon">✧</div>
              <h3>Innovation</h3>
              <p>
                Use AI-powered technology to create a smarter, more interactive
                fashion experience.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon">♡</div>
              <h3>Personal Style</h3>
              <p>
                Encourage everyone to explore different looks and discover
                styles that express their personality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <span className="about-label">HOW IT WORKS</span>

          <h2>
            Your Style Journey,
            <span> Made Simple</span>
          </h2>

          <p className="how-it-works-description">
            Experience a smarter way to explore fashion with just three simple
            steps.
          </p>

          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">📸</div>
              <h3>Upload Your Photo</h3>
              <p>
                Upload a clear photo to get started with your virtual try-on
                experience.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">👗</div>
              <h3>Choose Your Outfit</h3>
              <p>
                Explore our collection and select the outfit you would love to
                try.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">✨</div>
              <h3>See Your New Look</h3>
              <p>
                Discover your AI-generated virtual try-on preview and explore
                your style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT CTA */}
      <ExploreCTA />
    </main>
  );
}
