import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManageEvents from "./pages/AdminManageEvents";
import AdminViewBookings from "./pages/AdminViewBookings";
import AdminViewUsers from "./pages/AdminViewUsers";
import AdminViewOrganizers from "./pages/AdminViewOrganizers";
import AdminAddEvent from "./pages/AdminAddEvent";
import EventDetails from "./pages/EventDetails";
import AdminEditEvent from "./pages/AdminEditEvent";
import BookingPage from "./pages/BookingPage";
import Event from "./pages/Event";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OrganiserDashboard from "./pages/OrganiserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminScanQR from "./pages/AdminScanQR";
function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  return (
    <BrowserRouter>
      <Navbar token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events" element={<Event />} />
        <Route path="/admin/login" element={<AdminLogin setToken={setToken} />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-event" element={<AdminAddEvent />} />
        <Route path="/admin/events" element={<AdminManageEvents />} />
        <Route path="/admin/bookings" element={<AdminViewBookings />} />
        <Route path="/admin/users" element={<AdminViewUsers />} />
        <Route path="/admin/organizers" element={<AdminViewOrganizers />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/book/:id" element={<BookingPage />} />
        <Route path="/admin/edit-event/:id" element={<AdminEditEvent />} />
        <Route
  path="/organiser/dashboard"
  element={<OrganiserDashboard />}
/>

        <Route path="/login" element={<Login setToken={setToken} />} />
      <Route
  path="/organiser/dashboard"
  element={
    <ProtectedRoute role="organiser">
      <OrganiserDashboard />
    </ProtectedRoute>
  }
/>
<Route path="/admin/scan" element={<AdminScanQR />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
