import styles from "./RecentChapters.module.css";
import { TRANSLATIONS } from "../../utils/constants.js";

export function RecentChapters({ progress, onSelect }) {
  const recent = progress.slice(0, 10);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Pick up where you left off</h2>
        <span className={styles.subtitle}>Click a chapter to load it</span>
      </div>

      <div className={styles.grid}>
        {recent.map((p) => (
          <button key={p.id} className={styles.card} onClick={() => onSelect(p)}>
            <div className={styles.cardTop}>
              <span className={styles.bookName}>{p.book_name}</span>
              <span
                className={`${styles.badge} ${p.status === "mastered" ? styles.masterd : styles.learning}`}
              >
                {p.status}
              </span>
            </div>
            <div className={styles.cardBottom}>
              <span className={styles.chapter}>Chapter {p.chapter}</span>
              <span className={styles.translation}>
                {TRANSLATIONS.find((t) => t.id === p.translation?.name ?? p.translation)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
