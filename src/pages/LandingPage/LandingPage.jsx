import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";

const features = [
  {
    icon: "fa-solid fa-table-cells",
    title: "Bible Memory Grid",
    description:
      "Load any chapter and study the first letters of every word. Test your recall verse by verse.",
  },
  {
    icon: "fa-solid fa-layer-group",
    title: "Flash Cards",
    description:
      "Build decks from any verse in the Bible. Practice with flip cards and track what you know.",
  },
  {
    icon: "fa-solid fa-chart-simple",
    title: "Track Your Progress",
    description:
      "See your study streak, Bible coverage, and activity over time — all in one dashboard.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          Scripture<span>App</span>
        </div>
        <div className={styles.navActions}>
          <button className={styles.signInBtn} onClick={() => navigate("/sign-in")}>
            Sign In
          </button>
          <button className={styles.signUpBtn} onClick={() => navigate("/sign-in")}>
            Sign Up Free
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Bible memorization, reimagined</p>
          <h1 className={styles.heroTitle}>
            Hide God's Word
            <br />
            in your heart.
          </h1>
          <p className={styles.heroSubtitle}>
            ScriptureApp helps you memorize scripture through first-letter grids, flash cards, and
            progress tracking — simple, focused, and free.
          </p>
          <div className={styles.heroCtas}>
            <button className={styles.primaryBtn} onClick={() => navigate("/sign-in")}>
              Get Started Free
            </button>
            <button className={styles.ghostBtn} onClick={() => navigate("/guest")}>
              <i className="fa-solid fa-eye"></i> Try as Guest
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featuresInner}>
          {features.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className={f.icon}></i>
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className={styles.footerCta}>
        <h2 className={styles.footerCtaTitle}>Ready to start memorizing?</h2>
        <p className={styles.footerCtaSubtitle}>Free to use. No credit card required.</p>
        <div className={styles.heroCtas}>
          <button className={styles.primaryBtn} onClick={() => navigate("/sign-in")}>
            Create an Account
          </button>
          <button className={styles.ghostBtn} onClick={() => navigate("/guest")}>
            <i className="fa-solid fa-eye"></i> Try as Guest
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <span className={styles.logo}>
          Scripture<span>App</span>
        </span>
        <p className={styles.footerText}>Built to help you hide His word in your heart.</p>
      </footer>
    </div>
  );
}
