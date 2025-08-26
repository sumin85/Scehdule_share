import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiCalendar, FiUsers, FiBell, FiSettings } from "react-icons/fi";

const SideBar = ({ sidebarOpen = false, onClose }) => {
  const items = [
    { to: "/", icon: <FiHome />, label: "홈" },
    { to: "/MySchedule", icon: <FiCalendar />, label: "캘린더" },
    { to: "/Friend", icon: <FiUsers />, label: "친구" },
    { to: "/Notifications", icon: <FiBell />, label: "알림" },
    { to: "/Setting", icon: <FiSettings />, label: "설정" },
  ];

  return (
    <aside className={`sidebar${sidebarOpen ? " open" : ""}`} aria-label="사이드바">
      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `side-item${isActive ? " active" : ""}`
            }
            title={item.label}
            end
            onClick={() => onClose && onClose()}
          >
            {item.icon}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar; 