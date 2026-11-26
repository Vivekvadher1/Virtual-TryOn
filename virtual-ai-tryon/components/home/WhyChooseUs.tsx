import { BsFillSuitSpadeFill } from "react-icons/bs";
import { GoNorthStar } from "react-icons/go";
import { MdStyle } from "react-icons/md";
import { PiShoppingCartDuotone } from "react-icons/pi";

export default function WhyChooseUs() {
  const features = [
    {
      number: "01",
      title: "Virtual Try-On",
      description:
        "Try different fashion products virtually before making a purchase.",
      icon: <GoNorthStar />,
    },
    {
      number: "02",
      title: "Your Choice of Model",
      description:
        "Use your own photo or choose an AI-generated model for your virtual try-on.",
      icon: <BsFillSuitSpadeFill />,
    },
    {
      number: "03",
      title: "Explore Different Styles",
      description:
        "Discover clothing, footwear, eyewear and more in one place.",
      icon: <MdStyle />,
    },
    {
      number: "04",
      title: "Easy Shopping Experience",
      description: "Browse products and explore your personal style with ease.",
      icon: <PiShoppingCartDuotone />,
    },
  ];

  return (
    <section className="why-choose-us-section">
      <div className="why-choose-us-header">
        <span className="why-choose-us-label">THE DIFFERENCE</span>

        <h2>
          Why Choose <span>Us?</span>
        </h2>

        <p>
          Discover a smarter and more convenient way to explore fashion with our
          AI-powered virtual try-on experience.
        </p>
      </div>

      <div className="why-choose-us-grid">
        {features.map((feature) => (
          <article className="why-choose-us-card" key={feature.number}>
            <div className="why-choose-us-icon">{feature.icon}</div>

            <span className="why-choose-us-number">{feature.number}</span>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
