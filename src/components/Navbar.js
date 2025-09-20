import React from 'react';
import './Navbar.css';

function Navbar({ onSignIn, onSignUp, onAdminSignIn, user, tenant, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
  <span className="navbar-brand">Multitenant POC</span>
      </div>
      <div className="navbar-right navbar-actions">
        {!user ? (
          <>
            <button onClick={onSignIn}>Sign In</button>
            <button onClick={onSignUp}>Sign Up</button>
            <button onClick={onAdminSignIn}>Admin Sign In</button>
            <button onClick={() => onAdminSignIn('signup')}>Admin Sign Up</button>
          </>
        ) : (
          <>
            {user.role === 'admin' ? (
              <span className="navbar-user">Admin : {tenant}</span>
            ) : (
              <span className="navbar-user">User : {user.name}</span>
            )}
            <button onClick={onLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
