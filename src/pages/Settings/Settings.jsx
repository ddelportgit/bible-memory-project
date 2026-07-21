import { useState } from "react";
import styles from "./Settings.module.css";
import { useDashboard } from "../../context/DashboardContext";
import { useFlashCards } from "../../context/FlashCardContext";
import { useToast } from "../../context/ToastContext";
import { clearMemoryGridProgress } from "../../utils/memoryGridUtils";
import { clearAllDecks } from "../../utils/flashCardUtils";

export default function Settings() {
  const { setProgress } = useDashboard();
  const { setDecks } = useFlashCards();
  const { showToast } = useToast();

  const [confirmAction, setConfirmAction] = useState(null);
  // "progress" | "decks" | null

  async function handleConfirm() {
    if (confirmAction === "progress") {
      const ok = await clearMemoryGridProgress();
      if (ok) {
        setProgress([]);
        showToast("Memory Grid progress cleared");
      } else {
        showToast("Failed to clear progress", "error");
      }
    }

    if (confirmAction === "decks") {
      const ok = await clearAllDecks();
      if (ok) {
        setDecks([]);
        showToast("All decks deleted");
      } else {
        showToast("Failed to delete decks", "error");
      }
    }

    setConfirmAction(null);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your data and preferences</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Danger Zone</h2>

        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <h3 className={styles.cardTitle}>Reset Memory Grid Progress</h3>
            <p className={styles.cardDesc}>
              Clears all chapter progress, statuses, and your study streak. This cannot be undone.
            </p>
          </div>
          <button className={styles.dangerBtn} onClick={() => setConfirmAction("progress")}>
            Reset Progress
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <h3 className={styles.cardTitle}>Delete All Flash Card Decks</h3>
            <p className={styles.cardDesc}>
              Permanently deletes all your decks and the verses inside them. This cannot be undone.
            </p>
          </div>
          <button className={styles.dangerBtn} onClick={() => setConfirmAction("decks")}>
            Delete All Decks
          </button>
        </div>
      </div>

      {confirmAction && (
        <div className={styles.modalOverlay} onClick={() => setConfirmAction(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h2 className={styles.modalTitle}>Are you sure?</h2>
            <p className={styles.modalText}>
              {confirmAction === "progress"
                ? "This will permanently delete all your memory grid progress and streak data."
                : "This will permanently delete all your flash card decks and verses."}
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setConfirmAction(null)}>
                Cancel
              </button>
              <button className={styles.modalConfirmBtn} onClick={handleConfirm}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
