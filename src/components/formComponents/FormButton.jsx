import styles from './formButton.module.css'

function FormButton({text,type="submit"}){
return(
    <button type={type} className={styles.btn}>{text}</button>
);
}

export default FormButton