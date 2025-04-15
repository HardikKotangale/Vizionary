import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import logo from "../assets/vizionary-logo.png"; // Adjust the path if needed

export default function Header() {
  const { pathname } = useLocation();
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Generate", path: "/generate" },
    { name: "History", path: "/history" },
  ];

  return (
    <header className="lux-header d-flex align-items-center px-5 py-3">
      {/* 🔗 Clickable Logo */}
      <Link to="/" className="me-auto d-flex align-items-center">
        <img src={logo} alt="Vizionary Logo" className="logo-img" height="36" />
      </Link>

      <nav className="d-flex gap-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`lux-link ${pathname === item.path ? "active" : ""}`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
