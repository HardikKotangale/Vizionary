import "./css/Home.css";
import mascot from "../assets/hero-character.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      title: "Language Agnostic",
      desc: "Supports Python & R visualizations seamlessly.",
    },
    {
      title: "Real-Time Updates",
      desc: "Visuals update instantly as you write your code.",
    },
    {
      title: "Simple Interface",
      desc: "Intuitive, distraction-free layout with zero setup.",
    },
  ];

  const steps = [
    {
      title: "1. Paste Code",
      desc: "Write or paste your Python or R visualization script into our editor.",
    },
    {
      title: "2. Generate",
      desc: "Our engine renders static, interactive, or 3D visuals from your code.",
    },
    {
      title: "3. Explore",
      desc: "Download, share, or embed your generated visualizations instantly.",
    },
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>
            Transform Your <span className="highlight">Code</span> into <br />
            <span className="highlight">Stunning Visualizations</span>
          </h1>
          <p>
            Create, explore, and share visualizations effortlessly <br />
            using Python or R — with Vizionary.
          </p>
          <div className="hero-buttons">
            <Link to="/generate" className="btn-primary">
              Get Started
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              Learn More
            </a>
          </div>
        </motion.div>

        <div className="hero-right">
          <img src={mascot} alt="Vizionary Mascot" />
        </div>
      </section>

      {/* Divider */}
      <div className="divider-glow" />

      {/* Features Section */}
      <section className="features">
        <h2>Features</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              className="feature-card feature-glow"
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <motion.div
              className="step-card"
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
