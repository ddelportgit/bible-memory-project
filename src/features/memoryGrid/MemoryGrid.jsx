import { useState } from "react";
import styles from "./MemoryGrid.module.css";
import { VerseBubble } from "./VerseBubble";

export function MemoryGrid({ verses }) {
  const [selectedVerse, setSelectedVerse] = useState(null);

  return (
    <>
      <div className={styles.grid}>
        {verses.map((verse, index) => {
          const col = index % 5;
          const isFifthCol = col === 4;
          const row = Math.floor(index / 5);
          const isEvenRow = row % 2 === 0;

          let cellClass = styles.cell;
          if (isFifthCol) {
            cellClass += isEvenRow ? ` ${styles.cellLight}` : ` ${styles.cellDark}`;
          }

          return (
            <div
              key={verse.verseNumber}
              className={cellClass}
              onClick={() => setSelectedVerse(verse)}
            >
              <span className={isFifthCol ? styles.verseNumberLight : styles.verseNumber}>
                v{verse.verseNumber}
              </span>
              <div className={styles.letters}>{verse.letters.join(" ")}</div>
            </div>
          );
        })}
      </div>

      {selectedVerse && (
        <VerseBubble verse={selectedVerse} onClose={() => setSelectedVerse(null)} />
      )}
    </>
  );
}
