import { useState } from "react";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://adventurous-friendship-production-21d6.up.railway.app/admins/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Sign in failed.");
        setLoading(false);
        return;
      }

      localStorage.setItem("admin", JSON.stringify(data.admin));
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("Fi mishkle bel connection. Jarreb kaman.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">

        <div className="admin-top">
          <span className="admin-label">UCAFFE</span>
          <b className="admin-dot"></b>
        </div>

        <div className="admin-heading">
          <span>WELCOME BACK</span>
          <h2>
            Admin
            <em> Access</em>
          </h2>
          <div className="admin-line"></div>
          <p>Sign in to manage your menu, categories and items.</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="admin-field">
            <label>EMAIL</label>
            <input
              type="email"
              placeholder="admin@ucaffe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-field">
            <label>PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="admin-error">
              <span>!</span>
              {error}
            </div>
          )}

          <button type="submit" className="admin-login-btn" disabled={loading}>
            <span>{loading ? "SIGNING IN..." : "SIGN IN"}</span>
            <b>↗</b>
          </button>

        </form>

        <div className="admin-footer">
          <span>UCAFFE</span>
          <span>PRIVATE ADMIN AREA</span>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;