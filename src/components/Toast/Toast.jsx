import styles from "./Toast.module.css";

export function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

export function ToastItem({ toast, onRemove }) {
  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <i
        className={`fa-solid fa-${toast.type === "success" ? "circle-check" : "circle-xmark"} ${styles.icon}`}
      />
      <span className={styles.message}>{toast.message}</span>
      <button className={styles.closeBtn} onClick={() => onRemove(toast.id)}>
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
}
