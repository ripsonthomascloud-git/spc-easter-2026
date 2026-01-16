import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import styles from '../styles/AdminLogin.module.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1>Admin Login</h1>
        <p className={styles.subtitle}>Please sign in to access the admin panel</p>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <button onClick={() => window.location.href = '/'} className={styles.backLink}>
          Back to Main Site
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
