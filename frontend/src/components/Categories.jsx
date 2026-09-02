import { useEffect, useState } from 'react';
import './Categories.css';

const API_URL =
  'https://adventurous-friendship-production-21d6.up.railway.app/categories/get.php';

const IMAGE_BASE_URL =
  'https://adventurous-friendship-production-21d6.up.railway.app/';

function Categories({ onCategorySelect }) {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to connect to server');
        }

        return response.json();
      })
      .then((result) => {

        if (result.success) {

          setCategories(result.data);

        } else {

          setError('Failed to load categories');

        }

      })
      .catch((err) => {

        console.error('Categories error:', err);

        setError('Could not load categories');

      })
      .finally(() => {

        setLoading(false);

      });

  }, []);


  // Only main categories
  // parent_id = NULL
  const mainCategories = categories.filter(
    (category) =>
      category.parent_id === null ||
      category.parent_id === '0' ||
      category.parent_id === 0
  );


  if (loading) {

    return (
      <section className="categories" id="menu">

        <div className="categories-header">

          <p>EXPLORE</p>

          <h2>
            OUR <span>MENU</span>
          </h2>

          <div className="categories-line"></div>

          <span>
            Loading menu...
          </span>

        </div>

      </section>
    );

  }


  if (error) {

    return (
      <section className="categories" id="menu">

        <div className="categories-header">

          <p>EXPLORE</p>

          <h2>
            OUR <span>MENU</span>
          </h2>

          <div className="categories-line"></div>

          <span>
            {error}
          </span>

        </div>

      </section>
    );

  }


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

        {mainCategories.map((category, index) => {

          const imageUrl = category.image
            ? `${IMAGE_BASE_URL}${category.image}`
            : '';

          return (

            <article
              className={`category-card category-${index + 1}`}
              key={category.id}
              onClick={() => onCategorySelect(category)}
            >

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={category.name}
                />
              )}

              <div className="category-overlay"></div>

              <div className="category-content">

                <span className="category-number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="category-bottom">

                  <h3>
                    {category.name}
                  </h3>

                  <span className="category-arrow">
                    ↗
                  </span>

                </div>

              </div>

            </article>

          );

        })}

      </div>

    </section>
  );
}

export default Categories;