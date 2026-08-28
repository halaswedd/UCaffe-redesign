import { useState } from 'react';

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'http://localhost/UCaffe-redesign/backend/admins/login.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
  email: username.trim(),
  password: password,
}),
        }
      );

      // Read response as TEXT first
      const text = await response.text();

      console.log('SERVER RESPONSE:', text);

      // Try to convert it to JSON
      let result;

      try {
        result = JSON.parse(text);
      } catch (jsonError) {
        setError(
          'Server returned invalid JSON:\n\n' + text
        );
        return;
      }

      if (!response.ok || !result.success) {
        setError(
          result.message || 'Invalid username or password.'
        );
        return;
      }

      localStorage.setItem(
        'admin',
        JSON.stringify(result.admin)
      );

      onLogin(result.admin);

    } catch (error) {
      setError(
        'Connection error: ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f3ee',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}
      >

        <div style={{ marginBottom: '30px' }}>

          <div
            style={{
              fontSize: '14px',
              letterSpacing: '4px',
              marginBottom: '10px',
            }}
          >
            UCAFFE
          </div>

          <h1
            style={{
              margin: '0 0 10px',
              fontSize: '32px',
            }}
          >
            Admin Login
          </h1>

          <p>
            Sign in to manage your menu.
          </p>

        </div>


        <form onSubmit={handleLogin}>

          <label
            style={{
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Email / Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="Enter email"
            style={{
              width: '100%',
              padding: '13px',
              marginBottom: '20px',
              boxSizing: 'border-box',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          />


          <label
            style={{
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter password"
            style={{
              width: '100%',
              padding: '13px',
              marginBottom: '20px',
              boxSizing: 'border-box',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          />


          {error && (
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                background: '#fff0f0',
                padding: '12px',
                borderRadius: '8px',
                color: '#c00',
                fontSize: '12px',
                marginBottom: '20px',
              }}
            >
              {error}
            </pre>
          )}


          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AdminLogin;