import { useState } from "react";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost/UCaffe-redesign/backend/admins/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Server response:", text);
        throw new Error("Server returned invalid JSON.");
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password.");
      }

      localStorage.setItem("admin", JSON.stringify(data.admin));

      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error(err);
      setError(
        err.message === "Failed to fetch"
          ? "Could not connect to the server."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">

      <div className="admin-login-image">
        <div className="admin-login-image-overlay"></div>

        <div className="admin-brand">
          <span>EST. 2026</span>
          <h1>UCAFFE</h1>
          <p>COFFEE • FOOD • MOMENTS</p>
        </div>

        <div className="admin-image-bottom">
          <span>ADMINISTRATION</span>
          <span>01 / 01</span>
        </div>
      </div>

      <div className="admin-login-panel">

        <div className="admin-login-content">

          <div className="admin-top">
            <span className="admin-label">UCAFFE</span>

            <div className="admin-dot"></div>
          </div>

          <div className="admin-heading">
            <span>WELCOME BACK</span>

            <h2>
              Admin
              <br />
              <em>Access</em>
            </h2>

            <div className="admin-line"></div>

            <p>
              Sign in to manage your menu,
              categories and items.
            </p>
          </div>

          <form onSubmit={handleLogin}>

            <div className="admin-field">
              <label>Email</label>

              <input
                type="email"
                placeholder="admin@ucaffe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="admin-field">
              <label>Password</label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="admin-error">
                <span>!</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
            >
              <span>
                {loading ? "SIGNING IN..." : "SIGN IN"}
              </span>

              {!loading && <b>↗</b>}
            </button>

          </form>

          <div className="admin-footer">
            <span>UCAFFE</span>
            <span>PRIVATE ADMIN AREA</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;