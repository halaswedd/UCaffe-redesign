import { useEffect, useState } from 'react';
import './Navbar.css';

function Navbar({ menuPage = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navbarClass = `
    navbar
    ${scrolled ? 'navbar-scrolled' : ''}
    ${menuPage ? 'navbar-menu-page' : ''}
  `;

  const handleMenuClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={navbarClass}>
      {/* LOGO */}
      <a
        href="/"
        className="nav-logo"
        aria-label="U-Cafe Home"
      >
        <img
          src="/src/assets/images/ucafe-logo.png"
          alt="U-Cafe"
        />
      </a>

      {/* DESKTOP LINKS */}
      <nav className="nav-links">
        <a href="/#menu">MENU</a>
        <a href="/#contact">CONTACT</a>
      </nav>

      {/* MOBILE BUTTON */}
      <button
        className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Open menu"
        aria-expanded={mobileMenuOpen}
      >
        <span></span>
        <span></span>
      </button>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <a href="/#menu" onClick={handleMenuClick}>
            MENU
          </a>

          <a href="/#contact" onClick={handleMenuClick}>
            CONTACT
          </a>
        </div>
      )}
    </header>
  );
}

export default Navbar;
