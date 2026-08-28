import { useEffect, useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>

      <a href="/" className="nav-logo" aria-label="U-Cafe Home">
        <img
          src="/src/assets/images/ucafe-logo.png"
          alt="U-Cafe"
        />
      </a>

      <nav className="nav-links">
        <a href="#menu">MENU</a>
        <a href="#contact">CONTACT</a>
      </nav>

      <button className="menu-toggle" aria-label="Open menu">
        <span></span>
        <span></span>
      </button>

    </header>
  );
}

export default Navbar;