import FormButton from "../../components/formComponents/FormButton";
import FormInput from "../../components/formComponents/FormInput";
import styles from "./auth.module.css";

function Signup() {
  return (
    <div className={styles.container}>
      <div className={styles.signupBody}>
        <header>
          <div className={styles.logo}>
            Zap<span>Talk</span>
          </div>
          <h1>Create a ZapTalk Account</h1>
        </header>
        <SignupForm onSubmit={() => {}} />
      </div>
    </div>
  );
}

function SignupForm({ onSubmit }) {
  return (
    <form action="" onSubmit={onSubmit} className={styles.form}>
      <div className={styles.inpContainer}>
        <FormInput type="email" label="Email" name="mail" />
      </div>
      <div className={styles.inpContainer}>
        <FormInput type="password" label="Password" name="password" />
      </div>
      <div className={styles.inpContainer}>
        <FormInput
          type="password"
          label="Confirm Password"
          name="confirmPassword"
        />
      </div>
      <FormButton text="Create account" />
    </form>
  );
}

export default Signup;
