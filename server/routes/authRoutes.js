const router = require("express").Router();
const protect = require("../middleware/auth");
const { register, login, me, updateMe } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.put("/me", protect, updateMe);

module.exports = router;
