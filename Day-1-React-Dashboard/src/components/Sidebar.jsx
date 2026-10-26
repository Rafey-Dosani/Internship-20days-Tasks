
function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Menu</h3>

      <nav>
        <a href="#dashboard" className="active">Dashboard</a>
        <a href="#analytics">Analytics</a>
        <a href="#projects">Projects</a>
        <a href="#settings">Settings</a>
      </nav>
    </aside>
  );
}

export default Sidebar;
