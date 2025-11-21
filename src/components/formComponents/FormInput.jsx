import styles from "./formInput.module.css";
function FormInput({ label, name, type = "text" }) {
  return (
    <>
      <label htmlFor={name} className={styles.inpLabel}>
        {label}:
      </label>
      <input
        type={type}
        name={name}
        id={name}
        required
        className={styles.inp}
      />
    </>
  );
}

export default FormInput;
