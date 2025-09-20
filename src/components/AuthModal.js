import PropTypes from 'prop-types';
import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ type, onClose, onAuthSuccess }) => {
  const [form, setForm] = useState({ email: '', password: '', name: '', surname: '', date_of_birth: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignup = type === 'signup';
  const isAdmin = type === 'admin';
  const isAdminSignup = type === 'admin-signup';

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    let url = '';
    let body = {};
    if (isSignup) {
  url = `http://${window.location.hostname}:8000/api/user/signup`;
      body = {
        name: form.name,
        surname: form.surname,
        date_of_birth: form.date_of_birth,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation
      };
    } else if (isAdminSignup) {
  url = `http://${window.location.hostname}:8000/api/admin/signup`;
      body = {
        name: form.name,
        surname: form.surname,
        date_of_birth: form.date_of_birth,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation
      };
    } else if (isAdmin) {
  url = `http://${window.location.hostname}:8000/api/admin/login`;
      body = {
        email: form.email,
        password: form.password
      };
    } else {
  url = `http://${window.location.hostname}:8000/api/user/login`;
      body = {
        email: form.email,
        password: form.password
      };
    }
    try {
      const tenant = window.location.hostname.split('.')[0] || 'solar';
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Tenant': tenant,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
          if (data.token) {
            // JWT token received, pass to parent
            onAuthSuccess(data.token, data.user);
        onClose();
      } else {
        // Show validation errors if present
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(' ');
          setError(errorMessages);
        } else {
          setError(data.message || 'Authentication failed');
        }
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  let heading = 'Sign In';
  if (isSignup) heading = 'Sign Up';
  else if (isAdminSignup) heading = 'Sign Up as Admin';
  else if (isAdmin) heading = 'Sign In as Admin';
  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{heading}</h2>
        <form onSubmit={handleSubmit}>
          {(isSignup || isAdminSignup) && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="surname"
                placeholder="Surname"
                value={form.surname}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="date_of_birth"
                placeholder="Date of Birth"
                value={form.date_of_birth}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {(isSignup || isAdminSignup) && (
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />
          )}
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        {error && <p className="auth-error">{error}</p>}
      </div>
    </div>
  );
}

AuthModal.propTypes = {
  type: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onAuthSuccess: PropTypes.func.isRequired,
};


export default AuthModal;
