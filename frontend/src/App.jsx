import { useState } from "react";

import Navbar from "./components/Navbar";
import Opening from "./components/Opening";
import Categories from "./components/Categories";
import Menu from "./components/Menu";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

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