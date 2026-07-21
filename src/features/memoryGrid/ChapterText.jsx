import { useState } from "react";
import { stripHtml } from "../../utils/utils.js";
import styles from "./ChapterText.module.css";

export function ChapterText({ verses, selectedBook, chapter }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.chapterText}>
      <button className={styles.expandBtn} onClick={() => setExpanded(!expanded)}>
        <i className={`fa-solid fa-chevron-${expanded ? "up" : "down"}`}></i>
        {expanded ? "Hide Chapter" : "Check Chapter"}
      </button>

      {expanded && (
        <div className={styles.chapterContent}>
          <h2 className={styles.chapterHeading}>
            {selectedBook.name} - Chapter {chapter}
          </h2>
          {verses.map((verse) => (
            <p key={verse.verse} className={styles.verse}>
              <span className={styles.verseNum}>{verse.verse}</span>
              {stripHtml(verse.text)
                .split("\n")
                .map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
