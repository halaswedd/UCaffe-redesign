import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import logo from "../assets/images/ucafe-logo.png";

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");

    if (!savedAdmin) {
      window.location.href = "/admin";
      return;
    }

    setAdmin(JSON.parse(savedAdmin));
  }, []);

  const logout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/admin";
  };

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="dashboard-logo">

          <div className="dashboard-logo-mark">
            <img
              src={logo}
              alt="UCAFFE Logo"
              className="dashboard-logo-img"
            />
          </div>

          <div className="dashboard-logo-text">
            <span>UCAFFE</span>
            <small>ADMIN PANEL</small>
          </div>

        </div>


        <nav className="dashboard-nav">

          <button className="dashboard-nav-item active">
            <span>01</span>
            Dashboard
          </button>

          <button className="dashboard-nav-item">
            <span>02</span>
            Categories
          </button>

          <button className="dashboard-nav-item">
            <span>03</span>
            Menu Items
          </button>

        </nav>


        <button
          className="dashboard-logout"
          onClick={logout}
        >
          <span>LOG OUT</span>
          <b>↗</b>
        </button>

      </aside>


      {/* MAIN */}

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <span className="dashboard-eyebrow">
              UCAFFE / ADMINISTRATION
            </span>

            <h1>
              Good evening,
              <em> Admin.</em>
            </h1>

          </div>


          {/* ADMIN USER */}

          <div className="dashboard-user">

            <div className="dashboard-avatar">
              {admin?.email?.charAt(0).toUpperCase() || "A"}
            </div>

            <div className="dashboard-user-info">

              <strong>
                Administrator
              </strong>

              <span>
                {admin?.email || "Admin account"}
              </span>

            </div>

          </div>

        </header>


        {/* STATS */}

        <section className="dashboard-stats">

          <div className="stat-card">

            <span>01</span>

            <small>CATEGORIES</small>

            <strong>05</strong>

            <p>Menu sections</p>

          </div>


          <div className="stat-card">

            <span>02</span>

            <small>MENU ITEMS</small>

            <strong>24</strong>

            <p>Available items</p>

          </div>

        </section>


        {/* MANAGEMENT */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <span>MANAGEMENT</span>

              <h2>
                Manage your
                <em> menu.</em>
              </h2>

            </div>


            <p>
              Keep your UCAFFE menu
              fresh and up to date.
            </p>

          </div>


          <div className="management-grid">

            <button className="management-card">

              <span>01</span>

              <div>

                <h3>Categories</h3>

                <p>
                  Add, edit or remove
                  menu categories.
                </p>

              </div>

              <b>↗</b>

            </button>


            <button className="management-card">

              <span>02</span>

              <div>

                <h3>Menu Items</h3>

                <p>
                  Manage dishes,
                  drinks and prices.
                </p>

              </div>

              <b>↗</b>

            </button>


            <button className="management-card">

              <span>03</span>

              <div>

                <h3>Images</h3>

                <p>
                  Update category
                  images and visuals.
                </p>

              </div>

              <b>↗</b>

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;