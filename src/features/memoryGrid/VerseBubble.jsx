import { stripHtml } from "../../utils/utils.js";
import styles from "./VerseBubble.module.css";

export function VerseBubble({ verse, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.bubble} onClick={(e) => e.stopPropagation()}>
        <p className={styles.verseNum}>v{verse.verseNumber}</p>
        <p className={styles.text}>{stripHtml(verse.text)}</p>
      </div>
    </div>
  );
}
