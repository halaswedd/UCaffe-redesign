import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar">

      <a href="/" className="nav-logo">
        <img
          src="/src/assets/images/ucafe-logo.png"
          alt="U-Cafe"
        />
      </a>

      <nav className="nav-links">
        <a href="#menu">Menu</a>
        <a href="#contact">Contact</a>
      </nav>

      <button className="menu-toggle">
        <span></span>
        <span></span>
      </button>

    </header>
  );
}

export default Navbar;