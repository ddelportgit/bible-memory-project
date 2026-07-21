import { useEffect, useState } from "react";
import styles from "./BibleMemoryGrid.module.css";
import { TRANSLATIONS, BIBLE_BOOKS } from "../../utils/constants";
import { extractLetters, chunkVerses } from "../../utils/utils";
import { ChapterText } from "./ChapterText";
import { MemoryGrid } from "./MemoryGrid";
import { Instructions } from "./Instructions";
import { RecentChapters } from "./RecentChapters";
import { saveProgress, updateStatus, loadProgress } from "../../utils/memoryGridUtils.js";
import { useMemoryGrid } from "../../context/MemoryGridContext";
import { useDashboard } from "../../context/DashboardContext";
import { useToast } from "../../context/ToastContext";

function BibleMemoryGrid() {
  const {
    translation,
    setTranslation,
    bookId,
    setBookId,
    chapter,
    setChapter,
    chapterData,
    setChapterData,
    chunks,
    setChunks,
    progress,
    setProgress,
  } = useMemoryGrid();

  const { progress: dashboardProgress, setProgress: setDashboardProgress } = useDashboard();
  const { showToast } = useToast();
  const [chapterError, setChapterError] = useState(null);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const hasProgress = dashboardProgress && dashboardProgress.length > 0;
  const selectedBook = BIBLE_BOOKS.find((b) => b.id === bookId);
  const chapterCount = selectedBook ? selectedBook.chapters : 0;

  async function loadChapter(overrides = {}) {
    const t = overrides.translation || translation;
    const b = overrides.bookId || bookId;
    const c = overrides.chapter || chapter;
    const book = BIBLE_BOOKS.find((book) => book.id === b);

    setChapterError(null);
    setChapterLoading(true);

    try {
      const res = await fetch(`https://bolls.life/get-text/${t}/${b}/${c}/`);
      if (!res.ok) throw new Error();
      const verses = await res.json();
      console.log(JSON.stringify(verses[0]));

      setChapterData(verses);
      const extracted = extractLetters(verses);
      setChunks(chunkVerses(extracted));

      await saveProgress(t, b, book.name, c);
      const allProgress = await loadProgress();
      const current = allProgress.find(
        (p) => p.book_id === b && p.chapter === c && p.translation === t,
      );
      setProgress(current || null);
      setDashboardProgress(allProgress);
    } catch {
      setChapterError("Failed to load chapter. Check your connection and try again.");
    } finally {
      setChapterLoading(false);
    }
  }

  async function handleSelectRecent(p) {
    setTranslation(p.translation);
    setBookId(p.book_id);
    setChapter(p.chapter);
    await loadChapter({
      translation: p.translation,
      bookId: p.book_id,
      chapter: p.chapter,
    });
  }

  function handleClear() {
    setChapterData(null);
    setChunks([]);
    setProgress(null);
    setChapterError(null);
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        {chapterData && (
          <button className={styles.backBtn} onClick={handleClear}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        )}

        <select value={translation} onChange={(e) => setTranslation(e.target.value)}>
          {TRANSLATIONS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <select value={bookId} onChange={(e) => setBookId(Number(e.target.value))}>
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
          onClick={() => loadChapter()}
          disabled={!bookId || chapterLoading}
        >
          {chapterLoading ? "Loading..." : "Load Chapter"}
        </button>
      </div>

      {chapterError && (
        <div className={styles.errorBox}>
          <i className="fa-solid fa-triangle-exclamation"></i>
          <p>{chapterError}</p>
          <button className={styles.retryBtn} onClick={() => loadChapter()}>
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
            <MemoryGrid verses={chunk} chapterData={chapterData} />
          </div>
        ))}

      {chapterData && progress && !chapterError && (
        <div className={styles.statusBar}>
          <span className={styles.statusLabel}>Status:</span>
          <button
            className={`${styles.statusBtn} ${progress.status === "learning" ? styles.statusActive : ""}`}
            onClick={async () => {
              await updateStatus(progress.id, "learning");
              const updated = { ...progress, status: "learning" };
              setProgress(updated);
              setDashboardProgress((prev) => prev.map((p) => (p.id === progress.id ? updated : p)));
              showToast("Chapter marked as Learning");
            }}
          >
            <i className="fa-solid fa-book-open"></i> Learning
          </button>
          <button
            className={`${styles.statusBtn} ${progress.status === "mastered" ? styles.statusMastered : ""}`}
            onClick={async () => {
              await updateStatus(progress.id, "mastered");
              const updated = { ...progress, status: "mastered" };
              setProgress(updated);
              setDashboardProgress((prev) => prev.map((p) => (p.id === progress.id ? updated : p)));
              showToast("Chapter marked as Mastered");
            }}
          >
            <i className="fa-solid fa-check"></i> Mastered
          </button>
        </div>
      )}

      {chapterData && !chapterError && (
        <ChapterText verses={chapterData} selectedBook={selectedBook} chapter={chapter} />
      )}

      {chunks.length === 0 &&
        !chapterError &&
        (hasProgress ? (
          <div>
            <div className={styles.emptyHeader}>
              <button className={styles.howItWorksBtn} onClick={() => setShowInstructions(true)}>
                <i className="fa-solid fa-circle-question"></i> How it works
              </button>
            </div>
            <RecentChapters progress={dashboardProgress} onSelect={handleSelectRecent} />
          </div>
        ) : (
          <Instructions />
        ))}

      {showInstructions && <Instructions onClose={() => setShowInstructions(false)} />}
    </div>
  );
}

export default BibleMemoryGrid;
