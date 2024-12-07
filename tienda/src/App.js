import React, { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AdminRegisterForm from './components/AdminRegisterForm';
import ProductsPage from './components/ProductsPage';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('loggedInUser');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser)); // Restaurar el usuario logueado
      setView('products'); // Ir a la vista de productos
    }
  }, []);

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
    setView('products');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Eliminar token
    localStorage.removeItem('loggedInUser'); // Eliminar información del usuario
    setUser(null);
    setView('login');
  };

  const handleToggleRegister = (targetView) => {
    setView(targetView);
  };

  return (
    <div className="app-container">
      {view === 'login' && (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onToggleRegister={() => handleToggleRegister('register')}
        />
      )}
      {view === 'register' && (
        <RegisterForm
          onToggleRegister={() => handleToggleRegister('login')}
          onToggleAdminRegister={() => handleToggleRegister('admin-register')}
        />
      )}
      {view === 'admin-register' && (
        <AdminRegisterForm
          onToggleRegister={() => handleToggleRegister('register')}
          onToggleLogin={() => handleToggleRegister('login')}
        />
      )}
      {view === 'products' && (
        <ProductsPage user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
