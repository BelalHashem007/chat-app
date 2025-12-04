import FormButton from "../../components/formComponents/FormButton";
import FormInput from "../../components/formComponents/FormInput";
import styles from "./auth.module.css";
import { createUser } from "../../firebase/firebase_auth/authentication";
import { useNavigate, Link } from "react-router";
import { useState } from "react";
import { storeNewUserProfile } from "../../firebase/firebase_db/database";
import { useAuthContext } from "../../util/context/authContext";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [disableBtn, setDisableBtn] = useState(false);
  const {isAuthenticated} = useAuthContext();
  
  if (isAuthenticated) { // if user already logged in navigate to chat page
    navigate("/chat")
    return null; // stop rendering the login page
  } 

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    if (data.password.trim() !== data.confirmPassword.trim()) {
      setError("Password and Confirm Password don`t match");
      return;
    }
    if (data.password.length < 6) {
      setError("Password Length must be at least 6 characters.");
      return;
    }
    setDisableBtn(true);
    const result = await createUser(data.mail, data.password);
    if (result.user) {
      await storeNewUserProfile(result.user);
      navigate("/chat");
    } else {
      setError(result.error);
      setDisableBtn(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.signupBody}>
        <header>
          <div className={styles.logo}>
            Zap<span>Talk</span>
          </div>
          <h1 className={styles.pageHeader}>Create a ZapTalk Account</h1>
        </header>
        <SignupForm
          onSubmit={handleSubmit}
          error={error}
          disableBtn={disableBtn}
        />
        <div className={styles.createAccLink}>
          <p>
            already registered ? <Link to={"/login"}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function SignupForm({ onSubmit, error, disableBtn }) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.inpContainer}>
        <FormInput
          type="email"
          label="Email"
          name="mail"
          autocomplete="email"
        />
      </div>
      <div className={styles.inpContainer}>
        <FormInput
          type="password"
          label="Password"
          name="password"
          autocomplete="new-password"
        />
      </div>
      <div className={styles.inpContainer}>
        <FormInput
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          autocomplete="new-password"
        />
      </div>
      <FormButton text={disableBtn ? "Creating account...":"Create account"} type="submit" disableBtn={disableBtn} />
      <div className={styles.error}>{error}</div>
    </form>
  );
}

export default Signup;
