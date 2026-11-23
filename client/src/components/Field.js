// A labelled input that shows its validation error underneath.
export default function Field({ label, name, type = "text", value, onChange, onBlur, error, placeholder, disabled, as }) {
  const Tag = as === "textarea" ? "textarea" : "input";
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <Tag
        id={name}
        name={name}
        type={as === "textarea" ? undefined : type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={as === "textarea" ? 3 : undefined}
        className={error ? "input-error" : ""}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
