import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  const gameCards = [
    {
      title: "Local Match",
      description: "Pass & Play with friends locally",
      icon: "👥",
      mode: "LOCAL",
      color: "from-orange-400 to-pink-600",
      delay: 0,
    },
    {
      title: "Online Multiplayer",
      description: "Challenge players worldwide",
      icon: "🌍",
      mode: "ONLINE",
      color: "from-blue-400 to-indigo-600",
      delay: 0.1,
    },
    {
      title: "Vs Computer",
      description: "Sharpen your skills against AI",
      icon: "🤖",
      mode: "COMPUTER",
      color: "from-emerald-400 to-cyan-600",
      delay: 0.2,
    },
  ];

  return (
    <div className="home-page">
      {/* Animated Background Elements */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      <div className="home-content">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="header-section"
        >
          <div className="logo-container">
            <span className="logo-icon">🎲</span>
          </div>
          <h1 className="main-title">
            LUDO <span className="title-highlight">KING</span>
          </h1>
          <p className="subtitle">The Royal Game of India</p>
        </motion.div>

        <div className="modes-grid">
          {gameCards.map((card) => (
            <motion.div
              key={card.mode}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: card.delay, duration: 0.5 }}
              className="mode-card"
              onClick={() => navigate(`/setup/${card.mode}`)}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`card-gradient ${card.color}`}></div>
              <div className="card-content">
                <div className="icon-wrapper">
                  <span className="mode-icon">{card.icon}</span>
                </div>
                <h2 className="mode-title">{card.title}</h2>
                <p className="mode-desc">{card.description}</p>
                <div className="play-btn">
                  <span>PLAY NOW</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="footer-info">
        <p>v1.0.0 • Made with ❤️</p>
      </div>
    </div>
  );
}
