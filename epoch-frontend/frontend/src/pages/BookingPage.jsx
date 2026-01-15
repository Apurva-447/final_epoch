import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BookingPage.css";
import { API_URL } from "../config"; // ✅ ADD THIS
const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);
  const [payment, setPayment] = useState("upi");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/events/${id}`)
      .then(res => res.json())
      .then(data => setEvent(data));
  }, [id]);

  const handleBooking = async () => {
    setLoading(true);
    setMsg("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: id,
          seats,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("✅ Payment Successful & Booking Confirmed!");
        setTimeout(() => navigate("/"), 2500);
      } else {
        setMsg("❌ " + data.message);
      }
    } catch {
      setMsg("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="booking-page">
      {/* LEFT: IMAGE */}
      <div className="booking-left">
        <img src={`${API_URL}/${event.image}`} alt={event.title} />
      </div>

      {/* RIGHT: FORM */}
      <div className="booking-right">
        <h2>{event.title}</h2>
        <p>{event.description}</p>

        <p><b>Date:</b> {new Date(event.date).toDateString()}</p>
        <p><b>Location:</b> {event.location}</p>

        <hr />

        <label>Seats</label>
        <input
          type="number"
          min="1"
          max={event.availableSeats}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
        />

        <label>Payment Method</label>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={payment === "upi"}
              onChange={(e) => setPayment(e.target.value)}
            />
            UPI
          </label>

          <label>
            <input
              type="radio"
              name="payment"
              value="card"
              checked={payment === "card"}
              onChange={(e) => setPayment(e.target.value)}
            />
            Card
          </label>

          <label>
            <input
              type="radio"
              name="payment"
              value="netbanking"
              checked={payment === "netbanking"}
              onChange={(e) => setPayment(e.target.value)}
            />
            Net Banking
          </label>
        </div>

        <div className="summary">
          <h4>Order Summary</h4>
          <p>Price per seat: ₹{event.price}</p>
          <p>Seats: {seats ? seats : "0"}</p>
          <p><b>Total: ₹{seats * event.price}</b></p>
        </div>

        <button onClick={handleBooking} disabled={loading}>
          {loading ? "Processing Payment..." : "Pay & Confirm Booking"}
        </button>

        {msg && <p className="msg">{msg}</p>}
      </div>
    </div>
  );
};

export default BookingPage;
