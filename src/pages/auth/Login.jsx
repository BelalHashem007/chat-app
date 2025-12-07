import FormInput from "../../components/formComponents/FormInput";
import FormButton from "../../components/formComponents/FormButton";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import styles from "./auth.module.css";
import {
  signIn,
  guestSignIn,
} from "../../firebase/firebase_auth/authentication";
import Icon from "@mdi/react";
import { mdiAccountCircle } from "@mdi/js";
import { storeNewUserProfile } from "../../firebase/firebase_db/database";

function Login() {
  let navigate = useNavigate();
  const [error, setError] = useState(null);
  const [disableLoginBtn, setDisableLoginBtn] = useState(false);
  const [disableGuestBtn, setDisableGuestBtn] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    setDisableLoginBtn(true);
    const result = await signIn(data.mail, data.password);
    if (result.user) {
      navigate("/chat");
    } else {
      setError(result.error);
      setDisableLoginBtn(false);
    }
  }

  async function handleGuestLogin() {
    setDisableGuestBtn(true);
    const result = await guestSignIn();
    if (result.error) {
      //if error happens in signing in anonymously return after showing error message
      setError(result.error);
      setDisableGuestBtn(false);
      return;
    }
    //continute if no error
    if (result.user) {
      await storeNewUserProfile(result.user);
      navigate("/chat")
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBody}>
        <header>
          <div className={styles.logo}>
            Zap<span>Talk</span>
          </div>
          <h1 className={styles.pageHeader}>Sign in</h1>
        </header>

        <LoginForm
          onSubmit={handleSubmit}
          error={error}
          disableLoginBtn={disableLoginBtn}
        />
        <button
          className={styles.guestLogin}
          onClick={handleGuestLogin}
          disabled={disableGuestBtn}
          data-testid="guestBtn"
        >
          <Icon path={mdiAccountCircle} size={1} />{" "}
          {disableGuestBtn ? "Logging in..." : "Continue as Guest"}
        </button>
        <div className={styles.createAccLink}>
          <p>
            Not registered ? <Link to={"/signup"}>Create new account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function LoginForm({ onSubmit, error, disableLoginBtn }) {
  return (
    <form onSubmit={onSubmit} className={styles.form} aria-label="Login form">
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
          autocomplete="current-password"
        />
      </div>
      <FormButton
        text={disableLoginBtn ? "Logging in..." : "Log in"}
        type="Submit"
        disableBtn={disableLoginBtn}
      />
      {error && <div className={styles.error}>{error}</div>}
    </form>
  );
}

export default Login;
