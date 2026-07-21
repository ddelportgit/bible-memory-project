import { useState, useEffect } from "react";
import styles from "./BibleFlashCards.module.css";
import { loadDecks, createDeck, deleteDeck } from "../../utils/flashCardUtils";
import { DeckEditor } from "./DeckEditor";
import { PracticeMode } from "./PracticeMode";
import { useFlashCards } from "../../context/FlashCardContext";
import { supabase } from "../../utils/supabase";
import { useToast } from "../../context/ToastContext";

export default function BibleFlashCards() {
  const { view, setView, decks, setDecks, activeDeck, setActiveDeck, loading, setLoading } =
    useFlashCards();
  const [showNewDeckModal, setShowNewDeckModal] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameDeckId, setRenameDeckId] = useState(null);
  const [renameDeckName, setRenameDeckName] = useState("");

  const { showToast } = useToast();

  async function handleCreateDeck() {
    if (!newDeckName.trim()) return;
    const newDeck = await createDeck(newDeckName.trim());
    if (!newDeck) return;
    setDecks([newDeck, ...decks]);
    setNewDeckName("");
    setShowNewDeckModal(false);
    setActiveDeck(newDeck);
    setView("editor");
    showToast("Deck created");
  }

  async function handleDeleteDeck(deckId) {
    await deleteDeck(deckId);
    setDecks(decks.filter((d) => d.id !== deckId));
    showToast("Deck deleted");
  }

  function handleEditDeck(deck) {
    setActiveDeck(deck);
    setView("editor");
  }

  function handlePracticeDeck(deck) {
    setActiveDeck(deck);
    setView("practice");
  }

  function handleDeckUpdated(updatedDeck) {
    setDecks(decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));
    setActiveDeck(updatedDeck);
  }

  async function handleRenameDeck() {
    if (!renameDeckName.trim()) return;
    const { error } = await supabase
      .from("decks")
      .update({ name: renameDeckName.trim() })
      .eq("id", renameDeckId);

    if (error) {
      showToast("Failed to rename deck", "error");
    } else {
      setDecks(
        decks.map((d) => (d.id === renameDeckId ? { ...d, name: renameDeckName.trim() } : d)),
      );
    }
    setShowRenameModal(false);
    setRenameDeckName("");
    setRenameDeckId(null);
  }

  if (view === "editor") {
    return (
      <DeckEditor deck={activeDeck} onUpdate={handleDeckUpdated} onBack={() => setView("decks")} />
    );
  }

  if (view === "practice") {
    return <PracticeMode deck={activeDeck} onBack={() => setView("decks")} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Flash Card Decks</h1>
        <button className={styles.createBtn} onClick={() => setShowNewDeckModal(true)}>
          <i className="fa-solid fa-plus"></i> New Deck
        </button>
      </div>

      {loading && <p className={styles.loading}>Loading decks...</p>}

      {!loading && decks.length === 0 && (
        <div className={styles.empty}>
          <i className="fa-solid fa-layer-group"></i>
          <p>No decks yet. Create your first deck to get started.</p>
          <button className={styles.createBtn} onClick={() => setShowNewDeckModal(true)}>
            Create a Deck
          </button>
        </div>
      )}

      <div className={styles.deckGrid}>
        {decks.map((deck) => (
          <div key={deck.id} className={styles.deckCard}>
            <div className={styles.deckCardHeader}>
              <h2 className={styles.deckName}>{deck.name}</h2>
              <span className={styles.deckCount}>{deck.verses.length} verses</span>
            </div>
            <div className={styles.deckCardActions}>
              <button className={styles.editBtn} title="Edit" onClick={() => handleEditDeck(deck)}>
                <i className="fa-solid fa-pen"></i>
              </button>
              <button
                className={styles.renameBtn}
                title="Rename"
                onClick={() => {
                  setRenameDeckId(deck.id);
                  setRenameDeckName(deck.name);
                  setShowRenameModal(true);
                }}
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
              <button
                className={styles.practiceBtn}
                title="Practice"
                onClick={() => handlePracticeDeck(deck)}
                disabled={deck.verses.length === 0}
              >
                <i className="fa-solid fa-play"></i>
              </button>
              <button
                className={styles.deleteBtn}
                title="Delete"
                onClick={() => handleDeleteDeck(deck.id)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showNewDeckModal && (
        <div className={styles.modalOverlay} onClick={() => setShowNewDeckModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>New Deck</h2>
            <input
              className={styles.modalInput}
              type="text"
              placeholder="Enter deck name..."
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateDeck()}
              autoFocus
            />
            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setShowNewDeckModal(false)}>
                Cancel
              </button>
              <button
                className={styles.modalCreateBtn}
                onClick={handleCreateDeck}
                disabled={!newDeckName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showRenameModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRenameModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Rename Deck</h2>
            <input
              className={styles.modalInput}
              type="text"
              placeholder="Enter new name..."
              value={renameDeckName}
              onChange={(e) => setRenameDeckName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRenameDeck()}
              autoFocus
            />
            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setShowRenameModal(false)}>
                Cancel
              </button>
              <button
                className={styles.modalCreateBtn}
                onClick={handleRenameDeck}
                disabled={!renameDeckName.trim()}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
