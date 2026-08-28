import './Categories.css';

const categories = [
  {
    id: 1,
    name: 'Food',
    image: '/src/assets/images/categories/food.jpg',
  },
  {
    id: 2,
    name: 'Dessert',
    image: '/src/assets/images/categories/dessert.jpg',
  },
  {
    id: 3,
    name: 'Beverages',
    image: '/src/assets/images/categories/beverages.jpg',
  },
  {
    id: 4,
    name: 'Shisha',
    image: '/src/assets/images/categories/shisha.jpg',
  },
  {
    id: 5,
    name: 'Others',
    image: '/src/assets/images/categories/others.jpg',
  },
];

function Categories({ onCategorySelect }) {
  return (
    <section className="categories" id="menu">

      <div className="categories-header">
        <p>EXPLORE</p>

        <h2>
          OUR <span>MENU</span>
        </h2>

        <div className="categories-line"></div>

        <span>
          Something for every mood.
        </span>
      </div>

      <div className="categories-grid">

        {categories.map((category) => (
          <article
            className={`category-card category-${category.id}`}
            key={category.id}
            onClick={() => onCategorySelect(category)}
          >

            <img
              src={category.image}
              alt={category.name}
            />

            <div className="category-overlay"></div>

            <div className="category-content">

              <span className="category-number">
                0{category.id}
              </span>

              <div className="category-bottom">

                <h3>{category.name}</h3>

                <span className="category-arrow">
                  ↗
                </span>

              </div>

            </div>

          </article>
        ))}

      </div>

    </section>
  );
}

export default Categories;