function FormInput({ label, name, type = "text" }) {
  return (
    <div>
      <label htmlFor={name}>{label}:</label>
      <input type={type} name={name} id={name} required />
    </div>
  );
}

export default FormInput;
