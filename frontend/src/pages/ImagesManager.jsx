import { useEffect, useState } from "react";
import "./ImagesManager.css";

const CATEGORIES_API =
  "http://localhost/UCaffe-redesign/backend/categories/get.php";
const UPDATE_API =
  "http://localhost/UCaffe-redesign/backend/categories/update.php";
const IMAGE_BASE_URL =
  "http://localhost/UCaffe-redesign/backend/";

function ImagesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // tracks which category id is currently being saved
  const [savingId, setSavingId] = useState(null);

  /* =========================================
     LOAD CATEGORIES
  ========================================= */

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(CATEGORIES_API);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load categories");
      }

      setCategories(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* =========================================
     UPLOAD / REPLACE IMAGE
  ========================================= */

  const handleFileChange = async (category, e) => {
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
    setSavingId(category.id);

    try {
      const formData = new FormData();
      formData.append("id", category.id);
      formData.append("name", category.name);
      formData.append("parent_id", category.parent_id ?? "");
      formData.append("image", file);

      const response = await fetch(UPDATE_API, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update image");
      }

      await loadCategories();
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not upload image.");
    } finally {
      setSavingId(null);
      e.target.value = "";
    }
  };

  /* =========================================
     REMOVE IMAGE
  ========================================= */

  const handleRemove = async (category) => {
    const confirmed = window.confirm(
      `Remove the image for "${category.name}"?`
    );
    if (!confirmed) return;

    setError("");
    setSavingId(category.id);

    try {
      const formData = new FormData();
      formData.append("id", category.id);
      formData.append("name", category.name);
      formData.append("parent_id", category.parent_id ?? "");
      formData.append("remove_image", "1");

      const response = await fetch(UPDATE_API, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to remove image");
      }

      await loadCategories();
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not remove image.");
    } finally {
      setSavingId(null);
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="images-manager">
      <div className="images-manager-header">
        <div>
          <span>MENU / IMAGES</span>
          <h2>
            Manage your
            <em> images.</em>
          </h2>
        </div>
        <p>Upload, replace or remove category images.</p>
      </div>

      {error && <div className="images-error">{error}</div>}

      {loading ? (
        <div className="images-loading">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="images-empty">
          <span>NO CATEGORIES</span>
          <p>Add a category first to manage its image.</p>
        </div>
      ) : (
        <div className="images-grid">
          {categories.map((category) => {
            const imageUrl = category.image
              ? `${IMAGE_BASE_URL}${category.image}`
              : null;

            const isSaving = savingId === category.id;

            return (
              <div className="image-card" key={category.id}>
                <div className="image-card-preview">
                  {imageUrl ? (
                    <img src={imageUrl} alt={category.name} />
                  ) : (
                    <span className="image-card-placeholder">
                      NO IMAGE
                    </span>
                  )}

                  {isSaving && (
                    <div className="image-card-overlay">SAVING...</div>
                  )}
                </div>

                <div className="image-card-body">
                  <h3>{category.name}</h3>

                  <div className="image-card-actions">
                    <label className="image-upload-btn">
                      {imageUrl ? "REPLACE" : "UPLOAD"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(category, e)}
                        disabled={isSaving}
                      />
                    </label>

                    {imageUrl && (
                      <button
                        type="button"
                        className="image-remove-btn"
                        onClick={() => handleRemove(category)}
                        disabled={isSaving}
                      >
                        REMOVE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ImagesManager;
