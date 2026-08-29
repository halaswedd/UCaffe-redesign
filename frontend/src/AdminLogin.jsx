import { useState } from 'react';

import Navbar from './components/Navbar';
import Opening from './components/Opening';
import Categories from './components/Categories';
import Menu from './components/Menu';

import AdminLogin from './pages/AdminLogin';

function App() {

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    () => !!localStorage.getItem('admin')
  );


  // Check current URL
  const isAdminPage = window.location.pathname === '/admin';


  // =========================
  // ADMIN LOGIN
  // =========================

  if (isAdminPage && !isAdminLoggedIn) {

    return (
      <AdminLogin
        onLogin={() => {
          setIsAdminLoggedIn(true);
        }}
      />
    );

  }


  // =========================
  // ADMIN DASHBOARD
  // =========================

  if (isAdminPage && isAdminLoggedIn) {

    return (
      <div>
        <h1>Admin Dashboard</h1>

        <p>
          Welcome to the UCAFFE Admin Panel.
        </p>

        <button
          onClick={() => {
            localStorage.removeItem('admin');
            setIsAdminLoggedIn(false);
          }}
        >
          Logout
        </button>
      </div>
    );

  }


  // =========================
  // CUSTOMER WEBSITE
  // =========================

  const handleCategorySelect = (category) => {

    setSelectedCategory(category);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  };


  const handleBack = () => {

    setSelectedCategory(null);

    setTimeout(() => {

      document
        .getElementById('menu')
        ?.scrollIntoView({
          behavior: 'smooth',
        });

    }, 50);

  };


  return (
    <>
      <Navbar />

      {!selectedCategory ? (

        <>
          <Opening />

          <Categories
            onCategorySelect={handleCategorySelect}
          />
        </>

      ) : (

        <Menu
          category={selectedCategory}
          onBack={handleBack}
        />

      )}
    </>
  );
}

export default App;