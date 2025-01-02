import { useState } from "react";
import "../App.css";
import CreateLinkModal from "./CreateLinkModal";
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? ">" : "<"}
      </button>
      {!isCollapsed && (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h2>My App</h2>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <a href="/links">Links</a>
              </li>
              <li>
                <a href="/analytics">Analytics</a>
              </li>
              <li>
                <a href="#">Events</a>
              </li>
              <li>
                <a href="#">Settings</a>
              </li>
            </ul>
          </nav>
          <div className="sidebar-footer">
            <CreateLinkModal />
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
