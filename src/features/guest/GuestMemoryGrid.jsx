import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TRANSLATIONS, BIBLE_BOOKS } from "../../utils/constants";
import { extractLetters, chunkVerses } from "../../utils/utils";
import { MemoryGrid } from "../memoryGrid/MemoryGrid";
import { ChapterText } from "../memoryGrid/ChapterText";
import { Instructions } from "../memoryGrid/Instructions";
import styles from "./GuestMemoryGrid.module.css";

export default function GuestMemoryGrid() {
  const navigate = useNavigate();
  const [translation, setTranslation] = useState("KJV");
  const [bookId, setBookId] = useState("");
  const [chapter, setChapter] = useState(1);
  const [chapterData, setChapterData] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [chapterError, setChapterError] = useState(null);
  const [chapterLoading, setChapterLoading] = useState(false);

  const selectedBook = BIBLE_BOOKS.find((b) => b.id === bookId);
  const chapterCount = selectedBook ? selectedBook.chapters : 0;

  function handleTranslationChange(e) {
    setTranslation(e.target.value);
    setChapterData(null);
    setChunks([]);
    setChapterError(null);
  }

  function handleBookChange(e) {
    setBookId(Number(e.target.value));
    setChapter(1);
    setChapterData(null);
    setChunks([]);
    setChapterError(null);
  }

  async function loadChapter() {
    setChapterError(null);
    setChapterLoading(true);
    try {
      const res = await fetch(`https://bolls.life/get-text/${translation}/${bookId}/${chapter}/`);
      if (!res.ok) throw new Error();
      const verses = await res.json();
      setChapterData(verses);
      const extracted = extractLetters(verses);
      setChunks(chunkVerses(extracted));
    } catch {
      setChapterError("Failed to load chapter. Check your connection and try again.");
    } finally {
      setChapterLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Guest Banner */}
      <div className={styles.banner}>
        <span>
          <i className="fa-solid fa-eye"></i> You're in guest mode — progress is not saved.
        </span>
        <div className={styles.bannerActions}>
          <button className={styles.signInBtn} onClick={() => navigate("/sign-in")}>
            Sign In
          </button>
          <button className={styles.signUpBtn} onClick={() => navigate("/sign-in")}>
            Sign Up Free
          </button>
        </div>
      </div>

      {/* Logo */}
      <div className={styles.logo} onClick={() => navigate("/")}>
        Scripture<span>App</span>
      </div>

      <div className={styles.container}>
        <div className={styles.controls}>
          <select value={translation} onChange={handleTranslationChange}>
            {TRANSLATIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={bookId}
            onChange={handleBookChange}
            onFocus={() => !books.length && fetchBooks()}
          >
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

          <button
            className={styles.loadBtn}
            onClick={loadChapter}
            disabled={!bookId || chapterLoading}
          >
            {chapterLoading ? "Loading..." : "Load Chapter"}
          </button>
        </div>

        {chapterError && (
          <div className={styles.errorBox}>
            <i className="fa-solid fa-triangle-exclamation"></i>
            <p>{chapterError}</p>
            <button className={styles.retryBtn} onClick={loadChapter}>
              Try Again
            </button>
          </div>
        )}

        {!chapterError &&
          chunks.map((chunk, index) => (
            <div key={index}>
              {chunks.length > 1 && (
                <p className={styles.chunkLabel}>
                  Verses {chunk[0].verseNumber}–{chunk[chunk.length - 1].verseNumber}
                </p>
              )}
              <MemoryGrid verses={chunk} />
            </div>
          ))}

        {chapterData && !chapterError && (
          <ChapterText verses={chapterData} selectedBook={selectedBook} chapter={chapter} />
        )}
        {chunks.length === 0 && !chapterError && <Instructions />}
      </div>
    </div>
  );
}
