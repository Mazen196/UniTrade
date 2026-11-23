import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "../components/Field";
import { useAuth } from "../context/AuthContext";
import { validateEmail } from "../utils/validators";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");

  const errors = {
    email: validateEmail(form.email),
    password: form.password ? "" : "Password is required",
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });
  const show = (field) => (touched[field] ? errors[field] : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (hasErrors) return;
    const result = login(form);
    if (!result.ok) return setServerError(result.error);
    navigate("/profile");
  };

  return (
    <div className="auth-card">
      <h2>Welcome back</h2>
      <p className="subtitle">Login to your UniTrade account</p>
      {serverError && <div className="alert">{serverError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} error={show("email")} placeholder="you@university.edu" />
        <Field label="Password" name="password" type="password" value={form.password} onChange={handleChange} onBlur={handleBlur} error={show("password")} placeholder="Your password" />
        <button type="submit" className="btn btn-primary btn-block">Login</button>
      </form>
      <p className="switch">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
