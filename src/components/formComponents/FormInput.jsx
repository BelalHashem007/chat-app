import styles from "./formInput.module.css";
function FormInput(props) {
  return (
    <>
      <label htmlFor={props.name} className={styles.inpLabel}>
        {props.label}
      </label>
      <input
        type={props.type}
        name={props.name}
        id={props.name}
        autoComplete={props.autoComplete || ""}
        required
        className={styles.inp}
      />
    </>
  );
}

export default FormInput;
