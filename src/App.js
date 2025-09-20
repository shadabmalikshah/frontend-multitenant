import PropTypes from 'prop-types';
import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthModal from './components/AuthModal';

function App() {
  const [authModal, setAuthModal] = React.useState(null); // 'signin', 'signup', 'admin', 'admin-signup'
    // JWT token only
    const [userToken, setUserToken] = React.useState(() => localStorage.getItem('userToken') || '');
  const [user, setUser] = React.useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [tenant, setTenant] = React.useState(() => {
    const t = localStorage.getItem('tenant');
    return t || 'solar';
  });

  const handleSignIn = () => setAuthModal('signin');
  const handleSignUp = () => setAuthModal('signup');
  const handleAdminSignIn = (mode) => setAuthModal(mode === 'signup' ? 'admin-signup' : 'admin');
  const handleAuthSuccess = (token, userData) => {
    setUserToken(token);
    setUser(userData);
    localStorage.setItem('userToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    // Set tenant from userData if available
  if (userData?.email) {
App.propTypes = {
  user: PropTypes.object,
  userToken: PropTypes.string,
  tenant: PropTypes.string,
};
      const match = userData.email.match(/@(\w+)\.com$/);
      if (match) {
        setTenant(match[1]);
        localStorage.setItem('tenant', match[1]);
      }
    }
  };

  const handleLogout = () => {
    setUserToken('');
    setUser(null);
    setTenant('solar');
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    localStorage.setItem('tenant', 'solar');
  };

  return (
    <div className="App">
      <Navbar
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onAdminSignIn={handleAdminSignIn}
        user={user}
        tenant={tenant}
        onLogout={handleLogout}
      />
      <Home userToken={userToken} user={user} tenant={tenant} />
      {authModal && (
        <AuthModal
          type={authModal}
          onClose={() => setAuthModal(null)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
      <footer style={{textAlign: 'center', marginTop: '32px', padding: '16px', background: '#f8f8f8', fontWeight: 'bold'}}>
        shadab malik shah
      </footer>
    </div>
  );
}

export default App;
