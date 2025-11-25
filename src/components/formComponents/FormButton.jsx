import styles from './formButton.module.css'

function FormButton(props){
return(
    <button type={props.type} className={styles.btn} disabled={props.disableBtn}>{props.text}</button>
);
}

export default FormButton