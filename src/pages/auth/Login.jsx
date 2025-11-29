import FormInput from "../../components/formComponents/FormInput";
import FormButton from "../../components/formComponents/FormButton";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import styles from "./auth.module.css";
import { signIn } from "../../firebase/firebase_auth/authentication";
import { useAuthContext } from "../../util/context";

function Login() {
  let navigate = useNavigate();
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
    
    setDisableBtn(true);
    const result = await signIn(data.mail, data.password);
    if (result.user) {
      navigate("/chat");
    } else {
      setError(result.error);
      setDisableBtn(false);
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

        <LoginForm onSubmit={handleSubmit} error={error} disableBtn={disableBtn}/>
        <div className={styles.createAccLink}>
          <p>
            Not registered ? <Link to={"/signup"}>Create new account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onSubmit, error,disableBtn }) {
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
          autocomplete="current-password"
        />
      </div>
      <FormButton text={disableBtn ? "Logging in...":"Log in"} type="Submit" disableBtn={disableBtn}/>
      <div className={styles.error}>{error}</div>
    </form>
  );
}

export default Login;
