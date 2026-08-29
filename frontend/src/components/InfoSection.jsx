import "./InfoSection.css";

function InfoSection() {
  return (
    <section className="info-section">

      <div className="info-grid">

        <div className="info-item">
          <span>OPENING</span>

          <h3>OPEN DAILY</h3>

          <p>8:00 AM — 3:00 AM</p>
        </div>


        <div className="info-item">
          <span>LOCATION</span>

          <h3>FIND US</h3>

          <a
            href="https://maps.app.goo.gl/7egASrVYL72ompPt8"
            target="_blank"
            rel="noopener noreferrer"
          >
            VIEW LOCATION ↗
          </a>
        </div>


        <div className="info-item">
          <span>CONTACT</span>

          <h3>WHATSAPP</h3>

          <a
            href="https://wa.me/96170654733"
            target="_blank"
            rel="noopener noreferrer"
          >
            +961 70 654 733 ↗
          </a>
        </div>


        <div className="info-item">
          <span>SOCIAL</span>

          <h3>INSTAGRAM</h3>

          <a
            href="https://www.instagram.com/ucafe_gathering"
            target="_blank"
            rel="noopener noreferrer"
          >
            @UCAFE_GATHERING ↗
          </a>
        </div>

      </div>


      <div className="info-bottom">

        <span>
          © 2026 U-CAFE
        </span>

        <span>
          DESIGNED & DEVELOPED BY TRIPLY TEAM
        </span>

      </div>

    </section>
  );
}

export default InfoSection;