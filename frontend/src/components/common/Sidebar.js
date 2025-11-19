import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "📊",
      roles: ["admin", "student"],
    },
    {
      path: "/profile",
      label: "My Profile",
      icon: "👤",
      roles: ["admin", "student"],
    },
    { path: "/students", label: "Students", icon: "👥", roles: ["admin"] },
    { path: "/results", label: "Results", icon: "📝", roles: ["admin"] },
    { path: "/admin", label: "Admin Panel", icon: "⚙️", roles: ["admin"] },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          {filteredMenuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
