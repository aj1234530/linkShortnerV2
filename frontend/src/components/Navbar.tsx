import { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <svg
          width="65"
          height="64"
          viewBox="0 0 65 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M32.5 64C50.1731 64 64.5 49.6731 64.5 32C64.5 20.1555 58.0648 9.81393 48.5 4.28099V31.9999V47.9998H40.5V45.8594C38.1466 47.2207 35.4143 47.9999 32.5 47.9999C23.6634 47.9999 16.5 40.8364 16.5 31.9999C16.5 23.1633 23.6634 15.9999 32.5 15.9999C35.4143 15.9999 38.1466 16.779 40.5 18.1404V1.00812C37.943 0.350018 35.2624 0 32.5 0C14.8269 0 0.500038 14.3269 0.500038 32C0.500038 49.6731 14.8269 64 32.5 64Z"
            fill="black"
          />
        </svg>

        {/* Hamburger Icon */}
        <div className="hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Menu */}
        <div className={`menu ${isMenuOpen ? "show" : ""}`}>
          <ul>
            <li>Product</li>
            <li>Resources</li>
            <li>Enterprise</li>
            <li>Customers</li>
            <Link to="/dashboard">
              {" "}
              <li>Dashboard</li>
            </Link>
          </ul>
        </div>
        <div className="login-signup-buttons">
          <Link to="/login">
            <button>Log in</button>
          </Link>
          <Link to="/signup">
            <button>Sign up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;