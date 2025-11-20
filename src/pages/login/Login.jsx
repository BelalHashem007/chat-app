import FormInput from "../../components/FormInput";

function Login() {
  return (
    <form action="">
      <FormInput type="email" label="Email" name="mail"/>
      <FormInput type="password" label="Password" name="password"/>
      <button type="submit">Log in</button>
    </form>
  );
}

export default Login;
