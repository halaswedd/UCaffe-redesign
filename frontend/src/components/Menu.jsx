import { useState } from 'react';
import './Menu.css';

const menuData = {
  Food: {
    subcategories: [
      {
        name: 'Saj',
        items: [
          { name: 'Saj Item 1', price: '3.00' },
          { name: 'Saj Item 2', price: '4.00' },
          { name: 'Saj Item 3', price: '5.00' },
        ],
      },
      {
        name: 'Croissant',
        items: [
          { name: 'Croissant Item 1', price: '3.00' },
          { name: 'Croissant Item 2', price: '4.00' },
          { name: 'Croissant Item 3', price: '4.50' },
        ],
      },
    ],
  },

  Beverages: {
    subcategories: [
      {
        name: 'Hot Drinks',
        items: [
          { name: 'Espresso', price: '2.50' },
          { name: 'Cappuccino', price: '3.50' },
          { name: 'Latte', price: '4.00' },
          { name: 'Turkish Coffee', price: '3.00' },
        ],
      },
      {
        name: 'Cold Drinks',
        items: [
          { name: 'Iced Coffee', price: '4.00' },
          { name: 'Iced Latte', price: '4.50' },
          { name: 'Iced Americano', price: '3.50' },
        ],
      },
      {
        name: 'Other Drinks',
        items: [
          { name: 'Soft Drink', price: '2.00' },
          { name: 'Energy Drink', price: '3.00' },
          { name: 'Water', price: '1.00' },
        ],
      },
      {
        name: 'Juice & Homemade Ice Tea',
        items: [
          { name: 'Fresh Orange Juice', price: '4.00' },
          { name: 'Lemonade', price: '3.50' },
          { name: 'Homemade Ice Tea', price: '4.00' },
        ],
      },
    ],
  },

  Dessert: {
    subcategories: [],
    items: [
      { name: 'Cheesecake', price: '5.00' },
      { name: 'Brownie', price: '4.50' },
      { name: 'Chocolate Cake', price: '5.00' },
    ],
  },

  Shisha: {
    subcategories: [],
    items: [
      { name: 'Love 66', price: '10.00' },
      { name: 'Mizyan', price: '10.00' },
      { name: 'Double Apple', price: '10.00' },
    ],
  },

  Others: {
    subcategories: [],
    items: [
      { name: 'Item 1', price: '3.00' },
      { name: 'Item 2', price: '4.00' },
    ],
  },
};

function Menu({ category, onBack }) {
  const data = menuData[category.name];

  const [selectedSubcategory, setSelectedSubcategory] = useState(
    data.subcategories.length > 0
      ? data.subcategories[0]
      : null
  );

  const items = selectedSubcategory
    ? selectedSubcategory.items
    : data.items || [];

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

        <div className="menu-title-line"></div>

      </div>


      {/* SUBCATEGORIES */}

      {data.subcategories.length > 0 && (

        <div className="menu-filters">

          {data.subcategories.map((subcategory) => (

            <button
              key={subcategory.name}
              className={
                selectedSubcategory?.name === subcategory.name
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

          {items.map((item, index) => (

            <div
              className="menu-item"
              key={`${item.name}-${index}`}
            >

              <span className="item-number">
                0{index + 1}
              </span>

              <h3>
                {item.name}
              </h3>

              <strong>
                ${item.price}
              </strong>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Menu;