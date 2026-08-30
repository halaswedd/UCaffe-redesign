import { useEffect, useState } from "react";
import "./ItemsManager.css";

const API = "http://localhost/UCaffe-redesign/backend";

function ItemsManager() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");

  /* =========================================
     LOAD ITEMS
  ========================================= */

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/items/get.php`);
      const data = await response.json();

      if (data.success) {
        setItems(data.data || []);
      } else {
        setError(data.message || "Failed to load items");
      }
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     LOAD CATEGORIES
  ========================================= */

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API}/categories/get.php`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadItems();
    loadCategories();
  }, []);

  /* =========================================
     RESET FORM
  ========================================= */

  const resetForm = () => {
    setName("");
    setCategoryId("");
    setPrice("");
    setEditingItem(null);
    setShowForm(false);
  };

  /* =========================================
     ADD ITEM
  ========================================= */

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  /* =========================================
     EDIT ITEM
  ========================================= */

  const handleEdit = (item) => {
    setEditingItem(item);

    setName(item.name);
    setCategoryId(item.category_id ? String(item.category_id) : "");
    setPrice(item.price);

    setShowForm(true);
  };

  /* =========================================
     SAVE ITEM
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Item name is required");
      return;
    }

    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    if (price === "" || Number(price) < 0) {
      setError("Please enter a valid price");
      return;
    }

    try {
      const endpoint = editingItem
        ? `${API}/items/update.php`
        : `${API}/items/create.php`;

      const body = editingItem
        ? {
            id: editingItem.id,
            name: name.trim(),
            category_id: Number(categoryId),
            price: Number(price),
          }
        : {
            name: name.trim(),
            category_id: Number(categoryId),
            price: Number(price),
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Something went wrong");
        return;
      }

      setMessage(
        editingItem
          ? "Item updated successfully."
          : "Item created successfully."
      );

      resetForm();
      await loadItems();
    } catch (err) {
      setError("Could not connect to server");
    }
  };

  /* =========================================
     DELETE ITEM
  ========================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API}/items/delete.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Failed to delete item");
        return;
      }

      setMessage("Item deleted successfully.");

      await loadItems();
    } catch (err) {
      setError("Could not connect to server");
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="items-manager">

      {/* HEADER */}

      <div className="items-header">

        <div>
          <span className="items-eyebrow">
            MENU / ITEMS
          </span>

          <h1>
            Manage your <em>menu.</em>
          </h1>

          <p>
            Add, edit or remove dishes, drinks and prices.
          </p>
        </div>

        <button
          className="items-add-button"
          type="button"
          onClick={handleAdd}
        >
          + ADD ITEM
        </button>

      </div>


      {/* MESSAGE */}

      {message && (
        <div className="items-message success">
          {message}
        </div>
      )}

      {error && (
        <div className="items-message error">
          {error}
        </div>
      )}


      {/* FORM */}

      {showForm && (
        <div className="item-form-card">

          <div className="item-form-header">
            <div>
              <span>
                {editingItem ? "EDIT ITEM" : "NEW ITEM"}
              </span>

              <h2>
                {editingItem
                  ? "Update item."
                  : "Add an item."}
              </h2>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="close-form"
            >
              ×
            </button>
          </div>


          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* NAME */}

              <div className="form-group">

                <label>
                  ITEM NAME
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cappuccino"
                />

              </div>


              {/* CATEGORY */}

              <div className="form-group">

                <label>
                  CATEGORY
                </label>

                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >

                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}

                </select>

              </div>


              {/* PRICE */}

              <div className="form-group">

                <label>
                  PRICE
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />

              </div>

            </div>


            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                CANCEL
              </button>

              <button
                type="submit"
                className="save-button"
              >
                {editingItem
                  ? "UPDATE ITEM"
                  : "CREATE ITEM"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* ITEMS */}

      <section className="items-list-section">

        <div className="items-list-heading">

          <div>
            <span>
              ALL ITEMS
            </span>

            <h2>
              Menu <em>collection.</em>
            </h2>
          </div>

          <strong>
            {items.length} ITEMS
          </strong>

        </div>


        {loading ? (

          <div className="items-empty">
            Loading items...
          </div>

        ) : items.length === 0 ? (

          <div className="items-empty">

            <h3>
              No menu items yet.
            </h3>

            <p>
              Start by adding your first item.
            </p>

            <button
              type="button"
              onClick={handleAdd}
            >
              + ADD FIRST ITEM
            </button>

          </div>

        ) : (

          <div className="items-table">

            <div className="items-table-head">
              <span>ITEM</span>
              <span>CATEGORY</span>
              <span>PRICE</span>
              <span>ACTIONS</span>
            </div>


            {items.map((item) => (

              <div
                className="items-table-row"
                key={item.id}
              >

                <div className="item-name">
                  <small>
                    #{String(item.id).padStart(2, "0")}
                  </small>

                  <strong>
                    {item.name}
                  </strong>
                </div>


                <div className="item-category">
                  {item.category_name || "No category"}
                </div>


                <div className="item-price">
                  ${Number(item.price).toFixed(2)}
                </div>


                <div className="item-actions">

                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                  >
                    EDIT
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                  >
                    DELETE
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default ItemsManager;