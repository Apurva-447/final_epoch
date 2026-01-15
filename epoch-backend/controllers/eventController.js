const Event = require("../models/Event");
const Booking = require("../models/Booking"); // ✅ ONLY ONCE

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const {
      title,
      description,
      date,
      location,
      price,
      totalSeats,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      price: Number(price) || 0,
      totalSeats: Number(totalSeats),
      availableSeats: Number(totalSeats), // 🔥 auto-set
      image: req.file.path,
      organiser: req.user.id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getBookingsByEvent = async (req, res) => {
  try {
    const bookings = await Booking.find({ event: req.params.id })
      .populate("user", "name email");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL EVENTS
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE EVENT
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE EVENT
exports.updateEvent = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.image = req.file.path;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE EVENT
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organiser: req.user.id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getOrganiserStats = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("event", "title price organiser")
      .populate("user", "name email");

    const organiserBookings = bookings.filter(
      b => b.event && b.event.organiser.toString() === req.user.id
    );

    const revenue = organiserBookings.reduce(
      (sum, b) => sum + b.seats * b.event.price,
      0
    );

    res.json({
      totalBookings: organiserBookings.length,
      revenue,
      bookings: organiserBookings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

