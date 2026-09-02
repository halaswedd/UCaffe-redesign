import { useEffect, useState } from "react";
import "./CategoriesManager.css";

const CATEGORIES_API =
  "https://adventurous-friendship-production-21d6.up.railway.app/categories/get.php";
const CREATE_API =
  "https://adventurous-friendship-production-21d6.up.railway.app/categories/create.php";
const UPDATE_API =
  "https://adventurous-friendship-production-21d6.up.railway.app/categories/update.php";
const DELETE_API =
  "https://adventurous-friendship-production-21d6.up.railway.app/categories/delete.php";
const IMAGE_BASE_URL =
  "https://adventurous-friendship-production-21d6.up.railway.app/";

function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [removeImageFlag, setRemoveImageFlag] = useState(false);

  const [form, setForm] = useState({ name: "", parent_id: "" });

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(CATEGORIES_API);
      if (!response.ok) throw new Error("Failed to connect to server");
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to load categories");
      }
      setCategories(result.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const mainCategories = categories.filter(
    (category) =>
      category.parent_id === null ||
      category.parent_id === "0" ||
      category.parent_id === 0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError("");
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImageFlag(false);
  };

  const removeSelectedImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setRemoveImageFlag(true);
    const input = document.getElementById("category-image");
    if (input) input.value = "";
  };

  const openAddForm = () => {
    setEditingCategory(null);
    setForm({ name: "", parent_id: "" });
    setSelectedFile(null);
    setImagePreview(null);
    setRemoveImageFlag(false);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name || "",
      parent_id:
        category.parent_id === null ? "" : String(category.parent_id),
    });
    setSelectedFile(null);
    setImagePreview(
      category.image ? `${IMAGE_BASE_URL}${category.image}` : null
    );
    setRemoveImageFlag(false);
    setShowForm(true);
    setError("");
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditingCategory(null);
    setSelectedFile(null);
    setImagePreview(null);
    setRemoveImageFlag(false);
    setForm({ name: "", parent_id: "" });
    setError("");
  };

  const createCategory = async () => {
    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("parent_id", form.parent_id);
      if (selectedFile) formData.append("image", selectedFile);

      const response = await fetch(CREATE_API, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to create category");
      }

      closeForm();
      await loadCategories();
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not create category.");
    } finally {
      setSaving(false);
    }
  };

  const updateCategory = async () => {
    if (!editingCategory) return;

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();
      formData.append("id", editingCategory.id);
      formData.append("name", form.name.trim());
      formData.append("parent_id", form.parent_id);
      if (selectedFile) formData.append("image", selectedFile);
      if (removeImageFlag) formData.append("remove_image", "1");

      const response = await fetch(UPDATE_API, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update category");
      }

      closeForm();
      await loadCategories();
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not update category.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );
    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(DELETE_API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(category.id) }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete category");
      }

      await loadCategories();
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not delete category.");
    }
  };

  const getParentName = (parentId) => {
    const parent = categories.find(
      (category) => Number(category.id) === Number(parentId)
    );
    return parent ? parent.name : "Main Category";
  };

  return (
    <div className="categories-manager">
      <div className="categories-manager-header">
        <div>
          <span>MENU / CATEGORIES</span>
          <h2>
            Manage your
            <em> categories.</em>
          </h2>
        </div>
        <p>Add, edit and organize your UCAFFE menu categories.</p>
      </div>

      <div className="categories-manager-top">
        <div className="categories-count">
          <span>{categories.length}</span>
          <small>TOTAL CATEGORIES</small>
        </div>

        <button
          type="button"
          className="add-category-btn"
          onClick={openAddForm}
        >
          <span className="add-icon">+</span>
          ADD CATEGORY
        </button>
      </div>

      {error && <div className="categories-error">{error}</div>}

      <div className="categories-manager-list">
        <div className="categories-list-header">
          <span>#</span>
          <span>CATEGORY</span>
          <span>TYPE</span>
          <span>ACTIONS</span>
        </div>

        {loading ? (
          <div className="categories-loading">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="categories-empty">
            <span>NO CATEGORIES</span>
            <p>Start building your menu.</p>
          </div>
        ) : (
          categories.map((category, index) => {
            const isMain =
              category.parent_id === null ||
              category.parent_id === "0" ||
              category.parent_id === 0;

            const imageUrl = category.image
              ? `${IMAGE_BASE_URL}${category.image}`
              : null;

            return (
              <div className="category-manager-row" key={category.id}>
                <span className="category-manager-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="category-manager-name">
                  <div className="category-manager-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={category.name} />
                    ) : (
                      <span className="no-category-image">—</span>
                    )}
                  </div>
                  <h3>{category.name}</h3>
                </div>

                <span
                  className={`category-manager-parent ${
                    isMain ? "main" : "sub"
                  }`}
                >
                  {isMain
                    ? "MAIN CATEGORY"
                    : getParentName(category.parent_id)}
                </span>

                <div className="category-manager-actions">
                  <button
                    type="button"
                    className="category-action-btn"
                    onClick={() => openEditForm(category)}
                    title="Edit"
                  >
                    ↗
                  </button>
                  <button
                    type="button"
                    className="category-action-btn delete"
                    onClick={() => deleteCategory(category)}
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showForm && (
        <div className="category-modal-overlay" onClick={closeForm}>
          <div
            className="category-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="category-modal-header">
              <div>
                <span>
                  {editingCategory ? "EDIT CATEGORY" : "NEW CATEGORY"}
                </span>
                <h3>
                  {editingCategory ? "Edit category" : "Add category"}
                </h3>
              </div>

              <button
                type="button"
                className="category-modal-close"
                onClick={closeForm}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <div className="category-form">
              <div className="category-form-field">
                <label htmlFor="category-name">CATEGORY NAME</label>
                <input
                  id="category-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Drinks"
                  autoFocus
                />
              </div>

              <div className="category-form-field">
                <label htmlFor="category-type">CATEGORY TYPE</label>

                <select
                  id="category-type"
                  name="parent_id"
                  value={form.parent_id}
                  onChange={handleChange}
                >
                  <option value="">Main Category</option>

                  {mainCategories
                    .filter(
                      (parent) =>
                        !editingCategory ||
                        Number(parent.id) !== Number(editingCategory.id)
                    )
                    .map((parent) => (
                      <option key={parent.id} value={parent.id}>
                        Subcategory of {parent.name}
                      </option>
                    ))}
                </select>

                <small className="category-help-text">
                  Select Main Category or choose an existing category as
                  the parent.
                </small>
              </div>

              <div className="category-form-field">
                <label htmlFor="category-image">CATEGORY IMAGE</label>

                <div className="simple-image-upload">
                  <input
                    id="category-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                {imagePreview && (
                  <div className="simple-image-preview">
                    <img src={imagePreview} alt="Category preview" />
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                    >
                      REMOVE
                    </button>
                  </div>
                )}

                <small className="image-help-text">
                  JPG, PNG or WEBP · Maximum 5MB
                </small>
              </div>

              <div className="category-modal-actions">
                <button
                  type="button"
                  className="category-cancel-btn"
                  onClick={closeForm}
                  disabled={saving}
                >
                  CANCEL
                </button>

                <button
                  type="button"
                  className="category-save-btn"
                  onClick={editingCategory ? updateCategory : createCategory}
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : editingCategory
                    ? "SAVE CHANGES"
                    : "CREATE CATEGORY"}
                  <span>↗</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesManager;
