import { useState, useEffect } from "react";
import { TRANSLATIONS, BIBLE_BOOKS } from "../../utils/constants";
import { getVerse, addVerseToDeck, removeVerseFromDeck } from "../../utils/flashCardUtils";
import { stripHtml } from "../../utils/utils.js";
import { useToast } from "../../context/ToastContext";
import styles from "./DeckEditor.module.css";

export function DeckEditor({ deck, onUpdate, onBack }) {
  const { showToast } = useToast();
  const [translation, setTranslation] = useState("KJV");
  const [bookId, setBookId] = useState("");
  const [chapter, setChapter] = useState(1);
  const [verseNumber, setVerseNumber] = useState(1);
  const [chapterVerses, setChapterVerses] = useState(null);
  const [verses, setVerses] = useState(deck.verses || []);
  const [loading, setLoading] = useState(false);
  const [chapterError, setChapterError] = useState(null);

  const selectedBook = BIBLE_BOOKS.find((b) => b.id === bookId);
  const chapterCount = selectedBook ? selectedBook.chapters : 0;
  const verseCount = chapterVerses ? chapterVerses.length : 0;

  useEffect(() => {
    if (!bookId) return;
    fetchChapter();
  }, [translation, bookId, chapter]);

  function fetchChapter() {
    setChapterError(null);
    fetch(`https://bolls.life/get-text/${translation}/${bookId}/${chapter}/`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setChapterVerses(data);
        setVerseNumber(1);
      })
      .catch(() => setChapterError("Failed to load chapter. Check your connection."));
  }

  function handleBookChange(e) {
    setBookId(Number(e.target.value));
    setChapter(1);
    setChapterVerses(null);
    setVerseNumber(1);
  }

  async function addVerse() {
    const verse = getVerse(
      chapterVerses,
      verseNumber,
      selectedBook.name,
      selectedBook.id,
      chapter,
      translation,
    );
    if (!verse) return;
    const alreadyAdded = verses.find(
      (v) => v.book_id === verse.bookId && v.chapter === verse.chapter && v.verse === verse.verse,
    );
    if (alreadyAdded) {
      showToast("Verse already in deck", "error");
      return;
    }
    setLoading(true);
    const added = await addVerseToDeck(deck.id, verse);
    if (added) {
      const updated = [...verses, added];
      setVerses(updated);
      onUpdate({ ...deck, verses: updated });
      showToast("Verse added to deck");
    } else {
      showToast("Failed to add verse", "error");
    }
    setLoading(false);
  }

  async function removeVerse(verseId) {
    await removeVerseFromDeck(verseId);
    const updated = verses.filter((v) => v.id !== verseId);
    setVerses(updated);
    onUpdate({ ...deck, verses: updated });
    showToast("Verse removed from deck");
  }

  const previewVerse = chapterVerses?.find((v) => v.verse === verseNumber);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        <h1 className={styles.title}>{deck.name}</h1>
      </div>

      <div className={styles.picker}>
        <select value={translation} onChange={(e) => setTranslation(e.target.value)}>
          {TRANSLATIONS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <select value={bookId} onChange={handleBookChange}>
          <option value="">Select a Book</option>
          {BIBLE_BOOKS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={chapter}
          onChange={(e) => setChapter(Number(e.target.value))}
          disabled={!bookId}
        >
          {Array.from({ length: chapterCount }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              Chapter {n}
            </option>
          ))}
        </select>

        <select
          value={verseNumber}
          onChange={(e) => setVerseNumber(Number(e.target.value))}
          disabled={!chapterVerses}
        >
          {Array.from({ length: verseCount }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              Verse {n}
            </option>
          ))}
        </select>

        <button className={styles.addBtn} onClick={addVerse} disabled={!chapterVerses || loading}>
          {loading ? "Adding..." : "Add to Deck"}
        </button>
      </div>

      {chapterError && (
        <div className={styles.errorBox}>
          <i className="fa-solid fa-triangle-exclamation"></i>
          <p>{chapterError}</p>
          <button className={styles.retryBtn} onClick={fetchChapter}>
            Try Again
          </button>
        </div>
      )}

      {chapterVerses && !chapterError && previewVerse && (
        <div className={styles.preview}>
          <span className={styles.previewRef}>
            {selectedBook.name} {chapter}:{verseNumber}
          </span>
          <p className={styles.previewText}>{stripHtml(previewVerse.text)}</p>
        </div>
      )}

      <div className={styles.deck}>
        <h2 className={styles.deckTitle}>Verses in this deck ({verses.length})</h2>
        {verses.length === 0 && (
          <p className={styles.empty}>No verses added yet. Pick a verse and click Add to Deck.</p>
        )}
        {verses.map((verse) => (
          <div key={verse.id} className={styles.deckItem}>
            <span className={styles.deckRef}>
              {verse.book} {verse.chapter}:{verse.verse}
            </span>
            <p className={styles.deckText}>{verse.text}</p>
            <button className={styles.removeBtn} onClick={() => removeVerse(verse.id)}>
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
