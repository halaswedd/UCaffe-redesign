import { useEffect, useState } from 'react';
import './Menu.css';

const CATEGORIES_API =
  'http://localhost/UCaffe-redesign/backend/categories/get.php';

const ITEMS_API =
  'http://localhost/UCaffe-redesign/backend/items/get.php';

function Menu({ category, onBack }) {
  const [categories, setCategories] = useState([]);
  const [itemsData, setItemsData] = useState([]);

  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        setError('');

        const [categoriesResponse, itemsResponse] =
          await Promise.all([
            fetch(CATEGORIES_API),
            fetch(ITEMS_API),
          ]);

        const categoriesResult =
          await categoriesResponse.json();

        const itemsResult =
          await itemsResponse.json();

        if (!categoriesResult.success) {
          throw new Error('Failed to load categories');
        }

        if (!itemsResult.success) {
          throw new Error('Failed to load items');
        }

        setCategories(categoriesResult.data);
        setItemsData(itemsResult.data);
      } catch (err) {
        console.error(err);

        setError(
          'Could not load the menu. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const subcategories = categories.filter(
    (cat) =>
      Number(cat.parent_id) === Number(category.id)
  );

  useEffect(() => {
    if (subcategories.length > 0) {
      setSelectedSubcategory(subcategories[0]);
    } else {
      setSelectedSubcategory(null);
    }
  }, [category.id, categories.length]);

  const currentCategoryId = selectedSubcategory
    ? selectedSubcategory.id
    : category.id;

  const items = itemsData.filter(
    (item) =>
      Number(item.category_id) ===
      Number(currentCategoryId)
  );

  if (loading) {
    return (
      <section className="menu-page">
        <button
          className="menu-back"
          onClick={onBack}
        >
          ← MENU
        </button>

        <div className="menu-page-header">
          <span>OUR MENU</span>

          <h1>{category.name}</h1>
        </div>

        <div className="menu-items">
          <div className="items-heading">
            <span>Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="menu-page">
        <button
          className="menu-back"
          onClick={onBack}
        >
          ← MENU
        </button>

        <div className="menu-page-header">
          <span>OUR MENU</span>

          <h1>{category.name}</h1>
        </div>

        <div className="menu-items">
          <div className="items-heading">
            <span>{error}</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="menu-page">

      {/* BACK */}
      <button
        className="menu-back"
        onClick={onBack}
      >
        ← MENU
      </button>

      {/* HEADER */}
      <div className="menu-page-header">
        <span>OUR MENU</span>

        <h1>{category.name}</h1>
      </div>

      {/* SUBCATEGORIES */}
      {subcategories.length > 0 && (
        <div className="menu-filters">
          {subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              className={
                selectedSubcategory?.id === subcategory.id
                  ? 'menu-filter active'
                  : 'menu-filter'
              }
              onClick={() =>
                setSelectedSubcategory(subcategory)
              }
            >
              {subcategory.name}
            </button>
          ))}
        </div>
      )}

      {/* ITEMS */}
      <div className="menu-items">

        <div className="items-heading">
          <span>
            {selectedSubcategory
              ? selectedSubcategory.name
              : category.name}
          </span>

          <span>
            {items.length} ITEMS
          </span>
        </div>

        <div className="items-list">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                className="menu-item"
                key={item.id}
              >
                <span className="item-number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3>{item.name}</h3>

                <strong>
                  ${Number(item.price).toFixed(2)}
                </strong>
              </div>
            ))
          ) : (
            <div className="menu-item">
              <h3>No items available yet.</h3>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default Menu;
