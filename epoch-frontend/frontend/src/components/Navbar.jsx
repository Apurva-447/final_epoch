import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <nav className="navbar">
      <div className="logo">EPOCH</div>

      <ul className="nav-links">
        <li><Link to="/" smooth={true} duration={500}>Home</Link></li>
        <li><Link to="events" smooth={true} duration={500}>Events</Link></li>
        <li><Link to="about" smooth={true} duration={500}>About</Link></li>
        <li><Link to="contact" smooth={true} duration={500}>Contact</Link></li>
      </ul>

      {token ? (
        <button className="nav-btn" onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/login">
          <button className="nav-btn">Login / Register</button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
