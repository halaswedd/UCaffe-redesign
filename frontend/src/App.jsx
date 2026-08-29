import { useState } from "react";

import Navbar from "./components/Navbar";
import Opening from "./components/Opening";
import Categories from "./components/Categories";
import Menu from "./components/Menu";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import "./App.css";


function App() {

  const path = window.location.pathname;


  if (path === "/admin") {
    return <AdminLogin />;
  }


  if (path === "/admin/dashboard") {
    return <AdminDashboard />;
  }


  return <Website />;
}


function Website() {

  const [selectedCategory, setSelectedCategory] = useState(null);


  const handleCategorySelect = (category) => {

    setSelectedCategory(category);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  const handleBack = () => {

    setSelectedCategory(null);

    setTimeout(() => {

      document
        .getElementById("menu")
        ?.scrollIntoView({
          behavior: "smooth",
        });

    }, 50);

  };


  return (
    <>
      <Navbar menuPage={!!selectedCategory} />


      {!selectedCategory ? (

        <>
          {/* =========================
              OPENING
          ========================= */}

          <Opening />


          {/* =========================
              MENU CATEGORIES
          ========================= */}

          <Categories
            onCategorySelect={handleCategorySelect}
          />


          {/* =========================
              INFORMATION
          ========================= */}

          <section
            className="info-section"
            id="contact"
          >

            <div className="info-header">

              <span>COME VISIT US</span>

              <h2>
                MORE THAN
                <em> COFFEE.</em>
              </h2>

              <p>
                Come gather, sip, stay and enjoy
                your time at U-CAFE.
              </p>

            </div>


            <div className="info-grid">

              {/* LOCATION */}

              <a
                href="https://maps.app.goo.gl/7egASrVYL72ompPt8"
                target="_blank"
                rel="noopener noreferrer"
                className="info-card"
              >

                <span className="info-icon">
                  ⌖
                </span>

                <div className="info-card-content">

                  <small>
                    FIND US
                  </small>

                  <h3>
                    Location
                  </h3>

                  <p>
                    Open in Google Maps
                  </p>

                </div>

                <b>
                  ↗
                </b>

              </a>


              {/* WHATSAPP */}

              <a
                href="https://wa.me/96170654733"
                target="_blank"
                rel="noopener noreferrer"
                className="info-card"
              >

                <span className="info-icon">
                  ◉
                </span>

                <div className="info-card-content">

                  <small>
                    GET IN TOUCH
                  </small>

                  <h3>
                    WhatsApp
                  </h3>

                  <p>
                    Chat with us
                  </p>

                </div>

                <b>
                  ↗
                </b>

              </a>


              {/* INSTAGRAM */}

              <a
                href="https://www.instagram.com/ucafe_gathering"
                target="_blank"
                rel="noopener noreferrer"
                className="info-card"
              >

                <span className="info-icon">
                  ◎
                </span>

                <div className="info-card-content">

                  <small>
                    FOLLOW US
                  </small>

                  <h3>
                    Instagram
                  </h3>

                  <p>
                    @ucafe_gathering
                  </p>

                </div>

                <b>
                  ↗
                </b>

              </a>


              {/* OPENING HOURS */}

              <div className="info-card info-hours">

                <span className="info-icon">
                  ◷
                </span>

                <div className="info-card-content">

                  <small>
                    WHEN TO VISIT
                  </small>

                  <h3>
                    Open Daily
                  </h3>

                  <p>
                    8:00 AM — 3:00 AM
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* =========================
              FOOTER
          ========================= */}

          <footer className="site-footer">

            <div className="footer-line"></div>

            <div className="footer-bottom">

              <span>
                © {new Date().getFullYear()} U-CAFE
              </span>

              <span>
                Developed by{" "}
                <strong>
                  TRIPLY TEAM
                </strong>
              </span>

            </div>

          </footer>

        </>

      ) : (

        /* =========================
           MENU
        ========================= */

        <Menu
          category={selectedCategory}
          onBack={handleBack}
        />

      )}

    </>
  );
}


export default App;