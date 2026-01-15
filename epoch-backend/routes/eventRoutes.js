const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getBookingsByEvent,
  getOrganiserStats,
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const upload = require("../config/upload");

/* ================= PUBLIC ROUTES ================= */

// Public: all events (Home page)
router.get("/", getEvents);

/* ================= PROTECTED ORGANISER ROUTES ================= */

// Organiser: own events
router.get(
  "/my-events",
  protect,
  allowRoles("organiser"),
  getMyEvents
);

// Organiser: bookings for an event
router.get(
  "/:id/bookings",
  protect,
  allowRoles("organiser"),
  getBookingsByEvent
);

/* ================= PUBLIC SINGLE EVENT ================= */

// Public: single event (KEEP THIS AFTER my-events)
router.get("/:id", getEventById);

/* ================= PROTECTED CRUD ================= */

// Create event (Admin + Organiser)
router.post(
  "/",
  protect,
  allowRoles("admin", "organiser"),
  upload.single("image"),
  createEvent
);

// Update event
router.put(
  "/:id",
  protect,
  allowRoles("admin", "organiser"),
  upload.single("image"),
  updateEvent
);

// Delete event
router.delete("/:id", protect, deleteEvent);

module.exports = router;
router.get(
  "/organiser/stats",
  protect,
  allowRoles("organiser"),
  getOrganiserStats
);
