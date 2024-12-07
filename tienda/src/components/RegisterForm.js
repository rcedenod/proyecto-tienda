import React, { useState } from 'react';
import { addUser, getUsers } from '../utils/db';
import './RegisterForm.css';

const RegisterForm = ({ onRegisterSuccess, onToggleRegister, onToggleAdminRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (username, password, confirmPassword) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    // Validar campos obligatorios
    if (!username || !password || !confirmPassword) {
      setErrorMessage('Todos los campos son obligatorios');
      setSuccessMessage('');
      return;
    }

    if (!usernameRegex.test(username)) {
      setErrorMessage('El nombre de usuario solo puede contener letras, números y guiones bajos, sin espacios.');
      setSuccessMessage('');
      return;
    }

    if (!usernameRegex.test(password)) {
      setErrorMessage('La contraseña de usuario solo puede contener letras, números y guiones bajos, sin espacios.');
      setSuccessMessage('');
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setSuccessMessage('');
      return;
    }

    try {
      // Verificar si el usuario ya existe
      const existingUsers = await getUsers();
      const userExists = existingUsers.some((user) => user.username === username);

      if (userExists) {
        setErrorMessage('El nombre de usuario ya está en uso');
        setSuccessMessage('');
        return;
      }

      // Registrar nuevo usuario
      await addUser({ username, password, role: 'user' });
      setErrorMessage('');
      setSuccessMessage('Registro exitoso');
      onRegisterSuccess(); // Notificar éxito al componente principal
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      setErrorMessage('Registro exitoso');
      setSuccessMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(username, password, confirmPassword);
  };

  return (
    <div className="register-form-container">

      <form className="register-form" onSubmit={handleSubmit}>
      <img className="logo" src="https://sinergiastore.cl/wp-content/uploads/2023/01/LOGO-1-1.png"></img>
        <div>
          <label>Nombre de usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={25}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={25}
          />
        </div>
        <div>
          <label>Confirmar contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            maxLength={25}
          />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <button type="submit">Registrarse</button>
        <p>
          ¿Eres administrador?{' '}
          <button type="button" onClick={onToggleAdminRegister}>
          Regístrate aquí
          </button>
        </p>
        <p>
        <button type="button" onClick={onToggleRegister}>
          ¿Ya tienes una cuenta? Inicia sesión
        </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
