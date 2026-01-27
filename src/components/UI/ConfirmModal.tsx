import { motion } from "framer-motion";
import React from "react";
import "../Game/WinnerModal.css";

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="winner-modal-overlay">
      <motion.div
        className="winner-modal"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          maxWidth: "400px",
          padding: "2rem",
          borderColor: "rgba(239, 68, 68, 0.5)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        }}
      >
        <h2
          style={{
            color: "white",
            fontSize: "1.5rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            color: "#cbd5e1",
            marginBottom: "2rem",
            textAlign: "center",
            lineHeight: "1.5",
          }}
        >
          {message}
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "0.8rem 1.5rem",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "0.8rem 1.5rem",
              background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
              border: "none",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
            }}
          >
            Exit Game
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmModal;
