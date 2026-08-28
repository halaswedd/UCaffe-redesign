import './Opening.css';

function Opening() {
  return (
    <section className="opening">

      <div className="opening-image"></div>

      <div className="opening-overlay"></div>

      <div className="opening-content">

        <p className="opening-small">
          GATHERING & MORE
        </p>

        <h1>
          U-CAFE
        </h1>

        <p className="opening-tagline">
          A place to gather, sip and stay.
        </p>

        <button className="explore-btn">
          EXPLORE MENU
          <span>↗</span>
        </button>

      </div>

      <div className="scroll-indicator">
        <span>SCROLL TO EXPLORE</span>
        <div></div>
      </div>

    </section>
  );
}

export default Opening;