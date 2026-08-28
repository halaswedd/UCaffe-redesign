import { useState } from 'react';

import Navbar from './components/Navbar';
import Opening from './components/Opening';
import Categories from './components/Categories';
import Menu from './components/Menu';

function App() {

  const [selectedCategory, setSelectedCategory] = useState(null);

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