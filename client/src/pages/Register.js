import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "../components/Field";
import { useAuth } from "../context/AuthContext";
import { validateName, validateEmail, validatePassword, validateConfirm } from "../utils/validators";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");

  const errors = {
    name: validateName(form.name),
    email: validateEmail(form.email),
    password: validatePassword(form.password),
    confirm: validateConfirm(form.password, form.confirm),
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });
  const show = (field) => (touched[field] ? errors[field] : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (hasErrors) return;
    const result = register(form);
    if (!result.ok) return setServerError(result.error);
    navigate("/profile");
  };

  return (
    <div className="auth-card">
      <h2>Create your account</h2>
      <p className="subtitle">Join the student marketplace</p>
      {serverError && <div className="alert">{serverError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Full name" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} error={show("name")} placeholder="Mazen Ahmed" />
        <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} error={show("email")} placeholder="you@university.edu" />
        <Field label="Password" name="password" type="password" value={form.password} onChange={handleChange} onBlur={handleBlur} error={show("password")} placeholder="At least 6 characters" />
        <Field label="Confirm password" name="confirm" type="password" value={form.confirm} onChange={handleChange} onBlur={handleBlur} error={show("confirm")} placeholder="Repeat your password" />
        <button type="submit" className="btn btn-primary btn-block">Create account</button>
      </form>
      <p className="switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
