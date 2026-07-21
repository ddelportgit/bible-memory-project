import styles from "./Dashboard.module.css";
import { TRANSLATIONS } from "../../utils/constants";
import { BibleCoverageHeatmap } from "../../features/dashboard/BibleCoverageHeatmap";
import { ActivityHeatmap } from "../../features/dashboard/ActivityHeatmap";
import { useFlashCards } from "../../context/FlashCardContext";
import { useDashboard } from "../../context/DashboardContext";
import { calculateStreak } from "../../utils/memoryGridUtils";

export default function Dashboard() {
  const { decks } = useFlashCards();
  const { progress, loading } = useDashboard();
  const streak = calculateStreak(progress);

  const totalVerses = decks.reduce((acc, deck) => acc + deck.verses.length, 0);
  const totalChapters = progress.length;
  const mastered = progress.filter((p) => p.status === "mastered").length;
  const learning = progress.filter((p) => p.status === "learning").length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome back. Here is your study overview.</p>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <>
          <div className={styles.statsBanner}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{streak}</span>
              <span className={styles.statLabel}>Day streak</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalChapters}</span>
              <span className={styles.statLabel}>Chapters studied</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>{mastered}</span>
              <span className={styles.statLabel}>Chapters mastered</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>{learning}</span>
              <span className={styles.statLabel}>Chapters Learning</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>{decks.length}</span>
              <span className={styles.statLabel}>Flash Card Decks</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalVerses}</span>
              <span className={styles.statLabel}>Verses Saved</span>
            </div>
          </div>

          <BibleCoverageHeatmap progress={progress} />
          <ActivityHeatmap progress={progress} />

          <div className={styles.sections}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Recent Chapters</h2>
              {progress.length === 0 && <p className={styles.empty}>No chapters studied yet.</p>}
              {progress.slice(0, 5).map((p) => (
                <div key={p.id} className={styles.progressItem}>
                  <div className={styles.progressInfo}>
                    <span className={styles.progressName}>
                      {p.book_name} — Chapter {p.chapter}
                    </span>
                    <span className={styles.progressTranslation}>
                      {TRANSLATIONS.find((t) => t.id === p.translation)?.name ?? p.translation}
                    </span>
                  </div>
                  <span
                    className={`${styles.progressStatus} ${p.status === "mastered" ? styles.mastered : styles.learning}`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Your Decks</h2>
              {decks.length === 0 && <p className={styles.empty}>No decks created yet.</p>}
              {decks.slice(0, 5).map((deck) => (
                <div key={deck.id} className={styles.deckItem}>
                  <span className={styles.deckName}>{deck.name}</span>
                  <span className={styles.deckCount}>{deck.verses.length} verses</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
