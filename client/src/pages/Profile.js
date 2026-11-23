import { useState } from "react";
import Field from "../components/Field";
import { useAuth } from "../context/AuthContext";
import { validateName, validatePhone } from "../utils/validators";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || "",
    faculty: user.faculty || "",
    bio: user.bio || "",
  });
  const [touched, setTouched] = useState({});
  const [saved, setSaved] = useState(false);

  const errors = { name: validateName(form.name), phone: validatePhone(form.phone) };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleChange = (e) => {
    setSaved(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });
  const show = (field) => (touched[field] ? errors[field] : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, phone: true });
    if (hasErrors) return;
    updateProfile(form);
    setSaved(true);
  };

  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="profile-wrap">
      <aside className="profile-side">
        <div className="avatar">{initials}</div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <span className="badge">Student</span>
      </aside>
      <section className="profile-main">
        <h2>My profile</h2>
        <p className="subtitle">Update your personal information</p>
        {saved && <div className="alert alert-success">Profile saved successfully</div>}
        <form onSubmit={handleSubmit} noValidate>
          <Field label="Full name" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} error={show("name")} />
          <Field label="Email (cannot be changed)" name="email" value={user.email} disabled onChange={() => {}} />
          <div className="row">
            <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} onBlur={handleBlur} error={show("phone")} placeholder="01012345678" />
            <Field label="Faculty" name="faculty" value={form.faculty} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Computer Science" />
          </div>
          <Field label="Bio" name="bio" as="textarea" value={form.bio} onChange={handleChange} onBlur={handleBlur} placeholder="Tell buyers a little about yourself" />
          <button type="submit" className="btn btn-primary">Save changes</button>
        </form>
      </section>
    </div>
  );
}
