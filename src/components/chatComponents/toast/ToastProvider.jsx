import { useState } from "react";
import styles from "./toastProvider.module.css";
import { ToastContext } from "../../../util/context/toastContext";

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function showToast(content, duration = 5000) {
    const id = Date.now();

    console.log(id)
    setToasts((prev) => [...prev, { id, content }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id != id));
    }, duration);
  }

  return (
    <ToastContext value={{ showToast }}>
      {children}

      {toasts.map((toast, i) => {
        return (
          <div
            className={`${styles.notificationWrapper}`}
            style={{ bottom: 20 + i * 80 + "px" }}
            key={toast.id}
          >
            <button
              className={styles.closePopup}
              title="Close popup"
              onClick={() => {
                setToasts((prev) => prev.filter((t) => toast.id != t.id));
              }}
            >
              X
            </button>
            {toast.content}
          </div>
        );
      })}
    </ToastContext>
  );
}

export default ToastProvider;
