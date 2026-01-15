const Booking = require("../models/Booking");
const Event = require("../models/Event");
const User = require("../models/User");
const sendConfirmationMail = require("../utils/sendConfirmationMail");
const crypto = require("crypto");
const QRCode = require("qrcode");


// ✅ CREATE BOOKING (POST)
exports.createBooking = async (req, res) => {
  try {
    const { eventId, seats } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!eventId || !seats || seats <= 0) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.availableSeats < seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // ✅ 1. Generate ticket ID
  const ticketId = "EPOCH-" + crypto.randomUUID().slice(0, 8);


    // ✅ 2. Generate QR (base64 image)
    const qrCode = await QRCode.toDataURL(ticketId);

    const totalPrice = event.price * seats;

    // ✅ 3. Create booking WITH required fields
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      seats,
      totalPrice,
      ticketId,
      qrCode,
    });

    // ✅ 4. Update seats safely
    event.availableSeats = Math.max(
      0,
      Number(event.availableSeats) - Number(seats)
    );
    await event.save();

    // ✅ 5. Email confirmation (optional but good)
    const user = await User.findById(req.user.id);
    if (user?.email) {
      await sendConfirmationMail(user.email, event, seats, ticketId, qrCode);
    }

    res.status(201).json({
      message: "Booking successful",
      booking,
    });

  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Booking failed" });
  }
};


// ✅ GET ALL BOOKINGS (ADMIN)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("event", "title date location");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET BOOKINGS BY EVENT ID
exports.getBookingsByEvent = async (req, res) => {
  try {
    const bookings = await Booking.find({ event: req.params.eventId })
      .populate("user", "name email");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
