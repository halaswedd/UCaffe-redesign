import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import logo from "../assets/images/ucafe-logo.png";

import CategoriesManager from "./CategoriesManager";
import ItemsManager from "./ItemsManager";


function AdminDashboard() {

  const [admin, setAdmin] = useState(null);


  /* =========================================
   LOAD DASHBOARD STATS
========================================= */

const loadDashboardStats = async () => {
  try {
    setStatsLoading(true);

    const [categoriesRes, itemsRes] = await Promise.all([
      fetch("http://localhost/UCaffe-redesign/backend/categories/get.php"),
      fetch("http://localhost/UCaffe-redesign/backend/items/get.php"),
    ]);

    const categoriesData = await categoriesRes.json();
    const itemsData = await itemsRes.json();

    setCategoryCount(
      categoriesData.success ? (categoriesData.data || []).length : 0
    );

    setItemCount(
      itemsData.success ? (itemsData.data || []).length : 0
    );
  } catch (err) {
    console.error(err);
    setCategoryCount(0);
    setItemCount(0);
  } finally {
    setStatsLoading(false);
  }
};

  const [activePage, setActivePage] = useState("dashboard");
  const [categoryCount, setCategoryCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);


  /* =========================================
     CHECK ADMIN LOGIN
  ========================================= */

  useEffect(() => {

  const savedAdmin = localStorage.getItem("admin");

  if (!savedAdmin) {

    window.location.href = "/admin";

    return;
  }

  setAdmin(JSON.parse(savedAdmin));

  loadDashboardStats();

}, []);

  /* =========================================
     LOGOUT
  ========================================= */

  const logout = () => {

    localStorage.removeItem("admin");

    window.location.href = "/admin";
  };


  /* =========================================
     NAVIGATION
  ========================================= */

  const goTo = (page) => {

    setActivePage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  /* =========================================
     DASHBOARD
  ========================================= */

  const DashboardHome = () => {

    return (
      <>

        {/* HEADER */}

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

              {admin?.email
                ?.charAt(0)
                .toUpperCase() || "A"}

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

            <small>
              CATEGORIES
            </small>

            <strong>
  {statsLoading ? "—" : String(categoryCount).padStart(2, "0")}
</strong>

            <p>
              Menu sections
            </p>

          </div>


          <div className="stat-card">

            <span>02</span>

            <small>
              MENU ITEMS
            </small>

            <strong>
  {statsLoading ? "—" : String(itemCount).padStart(2, "0")}
</strong>

            <p>
              Available items
            </p>

          </div>

        </section>


        {/* MANAGEMENT */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <span>
                MANAGEMENT
              </span>

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


            {/* CATEGORIES */}

            <button
              className="management-card"
              type="button"
              onClick={() => goTo("categories")}
            >

              <span>
                01
              </span>

              <div>

                <h3>
                  Categories
                </h3>

                <p>
                  Add, edit or remove
                  menu categories.
                </p>

              </div>

              <b>
                ↗
              </b>

            </button>


            {/* MENU ITEMS */}

            <button
              className="management-card"
              type="button"
              onClick={() => goTo("items")}
            >

              <span>
                02
              </span>

              <div>

                <h3>
                  Menu Items
                </h3>

                <p>
                  Manage dishes,
                  drinks and prices.
                </p>

              </div>

              <b>
                ↗
              </b>

            </button>


            {/* IMAGES */}

            <button
              className="management-card"
              type="button"
              onClick={() => goTo("images")}
            >

              <span>
                03
              </span>

              <div>

                <h3>
                  Images
                </h3>

                <p>
                  Update category
                  images and visuals.
                </p>

              </div>

              <b>
                ↗
              </b>

            </button>

          </div>

        </section>

      </>
    );

  };


  /* =========================================
     PAGE
  ========================================= */

  return (

    <div className="admin-dashboard">


      {/* =====================================
         SIDEBAR
      ===================================== */}

      <aside className="admin-sidebar">


        {/* LOGO */}

        <div className="dashboard-logo">

          <div className="dashboard-logo-mark">

            <img
              src={logo}
              alt="UCAFFE Logo"
              className="dashboard-logo-img"
            />

          </div>


          <div className="dashboard-logo-text">

            <span>
              UCAFFE
            </span>

            <small>
              ADMIN PANEL
            </small>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="dashboard-nav">


          {/* DASHBOARD */}

          <button
            type="button"
            className={`dashboard-nav-item ${
              activePage === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() => goTo("dashboard")}
          >

            <span>
              01
            </span>

            Dashboard

          </button>


          {/* CATEGORIES */}

          <button
            type="button"
            className={`dashboard-nav-item ${
              activePage === "categories"
                ? "active"
                : ""
            }`}
            onClick={() => goTo("categories")}
          >

            <span>
              02
            </span>

            Categories

          </button>


          {/* MENU ITEMS */}

          <button
            type="button"
            className={`dashboard-nav-item ${
              activePage === "items"
                ? "active"
                : ""
            }`}
            onClick={() => goTo("items")}
          >

            <span>
              03
            </span>

            Menu Items

          </button>

        </nav>


        {/* LOGOUT */}

        <button
          type="button"
          className="dashboard-logout"
          onClick={logout}
        >

          <span>
            LOG OUT
          </span>

          <b>
            ↗
          </b>

        </button>

      </aside>


      {/* =====================================
         MAIN
      ===================================== */}

      <main className="dashboard-main">


        {/* DASHBOARD */}

        {activePage === "dashboard" && (
          <DashboardHome />
        )}


        {/* CATEGORIES */}

        {activePage === "categories" && (

          <CategoriesManager />

        )}


        {/* MENU ITEMS */}

{activePage === "items" && (

  <ItemsManager />

)}


        {/* IMAGES - LATER */}

        {activePage === "images" && (

          <div className="coming-soon">

            <span>
              MENU / IMAGES
            </span>

            <h2>
              Image manager
              <em> coming soon.</em>
            </h2>

            <p>
              Category images will be managed
              from this section.
            </p>

            <button
              type="button"
              onClick={() => goTo("dashboard")}
            >
              ← BACK TO DASHBOARD
            </button>

          </div>

        )}

      </main>

    </div>

  );

}

export default AdminDashboard;