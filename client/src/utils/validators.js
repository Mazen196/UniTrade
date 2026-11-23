// Reusable validation functions. Each returns an error message, or "" if valid.

export const validateName = (v) => {
  if (!v.trim()) return "Full name is required";
  if (v.trim().length < 3) return "Name must be at least 3 characters";
  return "";
};

export const validateEmail = (v) => {
  if (!v.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
  return "";
};

export const validatePassword = (v) => {
  if (!v) return "Password is required";
  if (v.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return "Password must contain letters and numbers";
  return "";
};

export const validateConfirm = (password, confirm) => {
  if (!confirm) return "Please confirm your password";
  if (password !== confirm) return "Passwords do not match";
  return "";
};

export const validatePhone = (v) => {
  if (!v) return ""; // optional
  if (!/^\+?\d{10,13}$/.test(v)) return "Enter a valid phone number (10-13 digits)";
  return "";
};
