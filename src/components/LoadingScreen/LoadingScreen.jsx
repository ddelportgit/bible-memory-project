import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  return (
    <div className={styles.container}>
      <p className={styles.text}>Loading...</p>
    </div>
  );
}
