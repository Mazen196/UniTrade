const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Never send the password back to the browser.
const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  faculty: u.faculty,
  bio: u.bio,
  role: u.role,
});

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");
const passwordOk = (v) => typeof v === "string" && v.length >= 6 && /[A-Za-z]/.test(v) && /\d/.test(v);

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || name.trim().length < 3) return res.status(400).json({ message: "Name must be at least 3 characters" });
    if (!emailOk(email)) return res.status(400).json({ message: "Enter a valid email address" });
    if (!passwordOk(password)) return res.status(400).json({ message: "Password must be 6+ characters with letters and numbers" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "This email is already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ token: makeToken(user._id), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", detail: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!emailOk(email) || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    const match = user && (await bcrypt.compare(password, user.password));
    if (!match) return res.status(401).json({ message: "Incorrect email or password" });

    res.json({ token: makeToken(user._id), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", detail: err.message });
  }
};

// GET /api/auth/me   (protected)
exports.me = (req, res) => res.json({ user: publicUser(req.user) });

// PUT /api/auth/me   (protected) - update profile
exports.updateMe = async (req, res) => {
  try {
    const { name, phone, faculty, bio } = req.body;
    if (name !== undefined && name.trim().length < 3) return res.status(400).json({ message: "Name must be at least 3 characters" });
    if (phone && !/^\+?\d{10,13}$/.test(phone)) return res.status(400).json({ message: "Enter a valid phone number" });

    const changes = {};
    if (name !== undefined) changes.name = name;
    if (phone !== undefined) changes.phone = phone;
    if (faculty !== undefined) changes.faculty = faculty;
    if (bio !== undefined) changes.bio = bio;

    const user = await User.findByIdAndUpdate(req.user._id, changes, { new: true });
    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", detail: err.message });
  }
};
