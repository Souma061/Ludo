import { useNavigate } from "react-router-dom";
import '../styles/HomePage.css';


export default function HomePage() {
  const navigate = useNavigate();

  const gameCards = [
    {
      title: 'Play Local Game',
      description: 'Play with friends on the same device.',
      icon:'👥',
      mode: 'LOCAL'

    },
    {
      title: 'Play Online Game',
      description: 'Play with friends over the internet.',
      icon:'🌐',
      mode: 'ONLINE'
    },
    {
      title: 'Play vs Computer',
      description: 'Challenge the computer AI.',
      icon:'🤖',
      mode: 'COMPUTER'
    },
  ];

  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="home-title">LUDO KING</h1>
        <p className="home-subtitle">Choose your game mode</p>

        <div className="cards-grid">
          {gameCards.map((card) => (
            <div
              key={card.mode}
              className="game-card"
              onClick={() => navigate(`/setup/${card.mode}`)}
            >
              <div className="card-icon">{card.icon}</div>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <button className="card-button">Select</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


}
