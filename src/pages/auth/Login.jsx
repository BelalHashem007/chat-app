import FormInput from "../../components/formComponents/FormInput";
import FormButton from "../../components/formComponents/FormButton";
import styles from "./auth.module.css";

function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.loginBody}>
        <header>
          <div className={styles.logo}>
            Zap<span>Talk</span>
          </div>
          <h1 className={styles.pageHeader}>Sign in</h1>
        </header>
        <LoginForm onSubmit={() => {}} />
        <div className={styles.createAccLink}>
          <p>
            Not registered ? <a href="/signup">Create new account</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onSubmit }) {
  return (
    <form action="" onSubmit={onSubmit} className={styles.form}>
      <div className={styles.inpContainer}>
        <FormInput type="email" label="Email" name="mail" />
      </div>
      <div className={styles.inpContainer}>
        <FormInput type="password" label="Password" name="password" />
      </div>
      <FormButton text="Log in" />
    </form>
  );
}

export default Login;
