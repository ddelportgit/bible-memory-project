import { useState } from "react";
import { BIBLE_BOOKS } from "../../utils/constants";
import styles from "./BibleCoverageHeatmap.module.css";

export function BibleCoverageHeatmap({ progress }) {
  const [tooltip, setTooltip] = useState(null);
  const [activeTestament, setActiveTestament] = useState("OT");

  const otBooks = BIBLE_BOOKS.filter((b) => b.testament === "OT");
  const ntBooks = BIBLE_BOOKS.filter((b) => b.testament === "NT");
  const books = activeTestament === "OT" ? otBooks : ntBooks;

  function getBookStatus(bookId) {
    const bookProgress = progress.filter((p) => p.book_id === bookId);
    if (bookProgress.length === 0) return "none";
    const total = BIBLE_BOOKS.find((b) => b.id === bookId)?.chapters || 0;
    const mastered = bookProgress.filter((p) => p.status === "mastered").length;
    const learning = bookProgress.filter((p) => p.status === "learning").length;
    if (mastered === total) return "mastered";
    if (mastered > 0) return "partial-mastered";
    if (learning > 0) return "learning";
    return "none";
  }

  function getBookStats(bookId) {
    const bookProgress = progress.filter((p) => p.book_id === bookId);
    const total = BIBLE_BOOKS.find((b) => b.id === bookId)?.chapters || 0;
    const mastered = bookProgress.filter((p) => p.status === "mastered").length;
    const learning = bookProgress.filter((p) => p.status === "learning").length;
    return { total, mastered, learning };
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Bible Coverage</h2>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTestament === "OT" ? styles.tabActive : ""}`}
            onClick={() => setActiveTestament("OT")}
          >
            Old Testament
          </button>
          <button
            className={`${styles.tab} ${activeTestament === "NT" ? styles.tabActive : ""}`}
            onClick={() => setActiveTestament("NT")}
          >
            New Testament
          </button>
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.none}`}></div>
          <span>Not started</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.learning}`}></div>
          <span>Learning</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.partialMastered}`}></div>
          <span>Partial</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.mastered}`}></div>
          <span>Mastered</span>
        </div>
      </div>

      <div className={styles.grid}>
        {books.map((book) => {
          const status = getBookStatus(book.id);
          const stats = getBookStats(book.id);
          return (
            <div
              key={book.id}
              className={`${styles.book} ${styles[status]}`}
              onMouseEnter={() => setTooltip({ book, stats })}
              onMouseLeave={() => setTooltip(null)}
            >
              <span className={styles.bookName}>{book.name}</span>
              <span className={styles.bookChapters}>
                {stats.mastered + stats.learning}/{book.chapters}
              </span>

              {tooltip?.book.id === book.id && (
                <div className={styles.tooltip}>
                  <p className={styles.tooltipTitle}>{book.name}</p>
                  <p className={styles.tooltipStat}>Total chapters: {book.chapters}</p>
                  <p className={styles.tooltipStat}>Learning: {stats.learning}</p>
                  <p className={styles.tooltipStat}>Mastered: {stats.mastered}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
