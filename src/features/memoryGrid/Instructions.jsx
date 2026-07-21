import styles from "./Instructions.module.css";

export function Instructions({ onClose }) {
  const content = (
    <div className={styles.instructions}>
      <div className={styles.icon}>
        <i className="fa-solid fa-book-open"></i>
      </div>
      <h2 className={styles.title}>How to use Bible Memory Grid</h2>
      <p className={styles.subtitle}>
        Select a chapter, study the first letters, and test your memory
      </p>
      <div className={styles.steps}>
        <div className={styles.step}>
          <span className={styles.stepNumber}>1</span>
          <p>
            Select a <strong>translation</strong>, <strong>book</strong> and{" "}
            <strong>chapter</strong> from the controls above
          </p>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>2</span>
          <p>
            Click <strong>Load Chapter</strong> to generate the memory grid
          </p>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>3</span>
          <p>
            Each block contains the <strong>first letters</strong> of every word in that verse
          </p>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>4</span>
          <p>
            Try to recall the verse from memory, then <strong>click a block</strong> to check your
            answer
          </p>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>5</span>
          <p>
            Use <strong>Check Chapter</strong> at the bottom to reveal the full chapter text
          </p>
        </div>
      </div>

      {onClose && (
        <button className={styles.closeBtn} onClick={onClose}>
          Got it
        </button>
      )}
    </div>
  );

  if (onClose) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return content;
}
