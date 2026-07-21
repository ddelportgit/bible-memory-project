import { useState } from "react";
import styles from "./PracticeMode.module.css";

export function PracticeMode({ deck, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [mode, setMode] = useState("reference");
  const [hasFlipped, setHasFlipped] = useState(false);

  const currentVerse = deck.verses[currentIndex];

  function handleFlip() {
    setFlipped(!flipped);
    if (!hasFlipped) setHasFlipped(true);
  }

  function handleCorrect() {
    setCorrect(correct + 1);
    goNext();
  }

  function handleIncorrect() {
    setIncorrect(incorrect + 1);
    goNext();
  }

  function goNext() {
    if (currentIndex + 1 >= deck.verses.length) {
      setFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
      setHasFlipped(false);
    }
  }

  function restart() {
    setCurrentIndex(0);
    setFlipped(false);
    setHasFlipped(false);
    setCorrect(0);
    setIncorrect(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={onBack}>
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
          <h1 className={styles.title}>{deck.name}</h1>

          <button
            className={styles.modeBtn}
            onClick={() => {
              setMode(mode === "verse" ? "reference" : "verse");
              setFlipped(false);
            }}
          >
            <i className="fa-solid fa-rotate"></i>
            {mode === "verse" ? "Verse → Reference" : "Reference → Verse"}
          </button>

          <span className={styles.progress}>
            {currentIndex + 1} / {deck.verses.length}
          </span>
        </div>

        <div className={styles.results}>
          <i className="fa-solid fa-trophy"></i>
          <h2>Practice Complete!</h2>
          <p>{deck.verses.length} verses reviewed</p>
          <div className={styles.score}>
            <div className={styles.scoreItem}>
              <span className={styles.scoreCorrect}>{correct}</span>
              <span>Correct</span>
            </div>
            <div className={styles.scoreItem}>
              <span className={styles.scoreIncorrect}>{incorrect}</span>
              <span>Incorrect</span>
            </div>
          </div>
          <button className={styles.restartBtn} onClick={restart}>
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        <h1 className={styles.title}>{deck.name}</h1>

        <button
          className={styles.modeBtn}
          onClick={() => {
            setMode(mode === "verse" ? "reference" : "verse");
            setFlipped(false);
          }}
        >
          <i className="fa-solid fa-rotate"></i>
          {mode === "verse" ? "Verse → Reference" : "Reference → Verse"}
        </button>

        <span className={styles.progress}>
          {currentIndex + 1} / {deck.verses.length}
        </span>
      </div>

      <div className={styles.card} onClick={handleFlip}>
        {!flipped ? (
          <div className={styles.cardFront}>
            {mode === "verse" ? (
              <p className={styles.cardText}>{currentVerse.text}</p>
            ) : (
              <p className={styles.cardRef}>
                {currentVerse.book} {currentVerse.chapter}:{currentVerse.verse}
              </p>
            )}
            <span className={styles.cardHint}>
              Click to reveal {mode === "verse" ? "reference" : "verse"}
            </span>
          </div>
        ) : (
          <div className={styles.cardBack}>
            {mode === "verse" ? (
              <>
                <p className={styles.cardRef}>
                  {currentVerse.book} {currentVerse.chapter}:{currentVerse.verse}
                </p>
                <p className={styles.cardTranslation}>{currentVerse.translation}</p>
              </>
            ) : (
              <p className={styles.cardText}>{currentVerse.text}</p>
            )}
          </div>
        )}
      </div>

      {hasFlipped ? (
        <div className={styles.actions}>
          <button className={styles.incorrectBtn} onClick={handleIncorrect}>
            <i className="fa-solid fa-xmark"></i> Incorrect
          </button>
          <button className={styles.correctBtn} onClick={handleCorrect}>
            <i className="fa-solid fa-check"></i> Correct
          </button>
        </div>
      ) : null}
    </div>
  );
}
