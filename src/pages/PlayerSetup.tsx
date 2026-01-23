import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/PlayerSetup.css";

type GameMode = "LOCAL" | "ONLINE" | "COMPUTER";

interface PlayerConfig {
  name: string;
  color: "RED" | "GREEN" | "YELLOW" | "BLUE";
  isAI: boolean;
}

export default function PlayerSetup() {
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string }>();
  const gameMode = mode?.toUpperCase() as GameMode;

  const [players, setPlayers] = useState<PlayerConfig[]>([
    { name: "Player 1", color: "RED", isAI: false },
    { name: "Player 2", color: "GREEN", isAI: false },
    { name: "Player 3", color: "YELLOW", isAI: gameMode === "COMPUTER" },
    { name: "Player 4", color: "BLUE", isAI: gameMode === "COMPUTER" },
  ]);

  const [numberOfPlayers, setNumberOfPlayers] = useState<2 | 3 | 4>(4);

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const handlePlayerTypeToggle = (index: number) => {
    if (gameMode === "COMPUTER" && index > 0) {
      const newPlayers = [...players];
      newPlayers[index].isAI = !newPlayers[index].isAI;
      setPlayers(newPlayers);
    }
  };

  const handleStartGame = () => {
    // Store player configuration in localStorage or pass via state
    localStorage.setItem("gameMode", gameMode);
    localStorage.setItem(
      "playerConfig",
      JSON.stringify(players.slice(0, numberOfPlayers)),
    );
    navigate("/game");
  };

  const getModeTitle = () => {
    switch (gameMode) {
      case "LOCAL":
        return "👥 Local Game Setup";
      case "ONLINE":
        return "🌐 Online Game Setup";
      case "COMPUTER":
        return "🤖 Play vs Computer";
      default:
        return "Game Setup";
    }
  };

  const getModeDescription = () => {
    switch (gameMode) {
      case "LOCAL":
        return "Configure players for local multiplayer on the same device";
      case "ONLINE":
        return "Set up your profile and create or join a room";
      case "COMPUTER":
        return "Choose your name and select AI difficulty";
      default:
        return "";
    }
  };

  return (
    <div className="setup-page">
      <div className="setup-container">
        {/* Header */}
        <div className="setup-header">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back
          </button>
          <h1 className="setup-title">{getModeTitle()}</h1>
          <p className="setup-description">{getModeDescription()}</p>
        </div>

        {/* Player Count Selector (Only for LOCAL and COMPUTER modes) */}
        {(gameMode === "LOCAL" || gameMode === "COMPUTER") && (
          <div className="player-count-section">
            <h3>Number of Players</h3>
            <div className="player-count-buttons">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  className={`count-button ${numberOfPlayers === count ? "active" : ""}`}
                  onClick={() => setNumberOfPlayers(count as 2 | 3 | 4)}
                >
                  {count} Players
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Player Configuration */}
        <div className="players-config">
          {players.slice(0, numberOfPlayers).map((player, index) => (
            <div
              key={player.color}
              className={`player-config-card ${player.isAI ? "ai-player" : "human-player"}`}
              style={{ borderColor: getColorValue(player.color) }}
            >
              <div className="player-header">
                <div
                  className="player-color-indicator"
                  style={{ backgroundColor: getColorValue(player.color) }}
                />
                <span className="player-number">Player {index + 1}</span>
                {gameMode === "COMPUTER" && index > 0 && (
                  <button
                    className="toggle-ai-button"
                    onClick={() => handlePlayerTypeToggle(index)}
                  >
                    {player.isAI ? "🤖 AI" : "👤 Human"}
                  </button>
                )}
              </div>

              <div className="player-input-group">
                <label htmlFor={`player-${index}`}>Name</label>
                <input
                  id={`player-${index}`}
                  type="text"
                  value={player.name}
                  onChange={(e) =>
                    handlePlayerNameChange(index, e.target.value)
                  }
                  disabled={player.isAI}
                  placeholder={player.isAI ? "AI Player" : "Enter name"}
                  maxLength={20}
                />
              </div>

              {player.isAI && gameMode === "COMPUTER" && (
                <div className="ai-difficulty">
                  <label>AI Difficulty</label>
                  <select className="difficulty-select">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Online Mode Specific Options */}
        {gameMode === "ONLINE" && (
          <div className="online-options">
            <div className="online-mode-buttons">
              <button className="mode-selection-button primary">
                Create Room
              </button>
              <button className="mode-selection-button secondary">
                Join Room
              </button>
            </div>
            <p className="online-notice">
              🌐 Online multiplayer is coming soon!
            </p>
          </div>
        )}

        {/* Start Game Button */}
        <button
          className="start-game-button"
          onClick={handleStartGame}
          disabled={gameMode === "ONLINE"}
        >
          {gameMode === "ONLINE" ? "Coming Soon" : "🎮 Start Game"}
        </button>
      </div>
    </div>
  );
}

function getColorValue(color: string): string {
  const colors: Record<string, string> = {
    RED: "#ef4444",
    GREEN: "#22c55e",
    YELLOW: "#eab308",
    BLUE: "#3b82f6",
  };
  return colors[color] || "#666";
}
