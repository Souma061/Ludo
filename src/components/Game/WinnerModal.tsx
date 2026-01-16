import { motion } from 'framer-motion';
import React from 'react';
import type { PlayerColor } from '../../types/index';
import './WinnerModal.css';

interface WinnerModalProps {
  winner: PlayerColor;
  rank: number;
  onClose: () => void;
  onReset: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, rank, onClose, onReset }) => {
  const getWinnerColor = (color: PlayerColor) => {
    const colors: Record<PlayerColor, string> = {
      RED: '#ef4444',
      GREEN: '#22c55e',
      YELLOW: '#eab308',
      BLUE: '#3b82f6'
    };
    return colors[color];
  };

  const getWinnerLabel = (color: PlayerColor) => {
    const labels: Record<PlayerColor, string> = {
      RED: '🔴 RED PLAYER',
      GREEN: '🟢 GREEN PLAYER',
      YELLOW: '🟡 YELLOW PLAYER',
      BLUE: '🔵 BLUE PLAYER'
    };
    return labels[color];
  };

  const getRankEmoji = (rank: number) => {
    const emojis = ['🥇', '🥈', '🥉', '🎖️'];
    return emojis[rank - 1] || '🎖️';
  };

  return (
    <motion.div
      className="winner-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="winner-modal"
        style={{ borderColor: getWinnerColor(winner) }}
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Background */}
        <div
          className="modal-bg"
          style={{
            background: `linear-gradient(135deg, ${getWinnerColor(winner)}20 0%, ${getWinnerColor(winner)}10 100%)`
          }}
        ></div>

        {/* Content */}
        <div className="modal-content">
          {/* Rank Badge */}
          <motion.div
            className="rank-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <span className="rank-emoji">{getRankEmoji(rank)}</span>
          </motion.div>

          {/* Congratulations Text */}
          <motion.h2
            className="modal-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            🎉 VICTORY! 🎉
          </motion.h2>

          {/* Winner Name */}
          <motion.p
            className="modal-winner"
            style={{ color: getWinnerColor(winner) }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {getWinnerLabel(winner)}
          </motion.p>

          {/* Rank Text */}
          <motion.p
            className="modal-rank"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Finished in Position #{rank}
          </motion.p>

          {/* Decorative Stars */}
          <motion.div
            className="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </motion.div>

          {/* Action Buttons */}
          <div className="modal-buttons">
            <motion.button
              className="btn-play-again"
              onClick={() => {
                onReset();
                onClose();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              🎮 Play Again
            </motion.button>

            <motion.button
              className="btn-close"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              ✕ Close
            </motion.button>
          </div>
        </div>

        {/* Animated Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            style={{
              backgroundColor: getWinnerColor(winner),
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            initial={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: 0
            }}
            animate={{
              opacity: 0,
              scale: 0,
              y: Math.random() * 300 - 150,
              x: Math.random() * 300 - 150
            }}
            transition={{
              duration: 2,
              delay: 0.2 + i * 0.1,
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default WinnerModal;
