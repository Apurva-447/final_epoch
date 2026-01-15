const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  addOrganizer, // Import the addOrganizer controller
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get(
  "/users",
  protect,
  allowRoles("admin"),
  getAllUsers
);

router.post(
  "/add-organizer",
  protect,
  allowRoles("admin"),
  addOrganizer
);

module.exports = router;
