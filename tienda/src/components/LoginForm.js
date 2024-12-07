import React, { useState } from 'react';
import { getUsers } from '../utils/db';
import './LoginForm.css';
import ParticlesBg from 'particles-bg';

const LoginForm = ({ onLoginSuccess, onToggleRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const users = await getUsers();
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      const token = btoa(`${user.username}:${new Date().toISOString()}`); // Crear un token simple
      localStorage.setItem('authToken', token); // Guardar token en localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(user)); // Guardar información del usuario
      onLoginSuccess(user);
    } else {
      setErrorMessage('Usuario o contraseña incorrectos');
    }
  };
  
  let config = {
    num: [1, 2],
    rps: 0.1,
    radius: [5, 40],
    life: [1.5, 3],
    v: [0.1, 0.3],
    tha: [-40, 40],
    alpha: [0.6, 0],
    scale: [1, 0.1],
    position: "all", 
    color: ["#005bb5"], 
    cross: "dead", 
    random: 5,  
    onParticleUpdate: (ctx, particle) => {
      ctx.beginPath();
      ctx.arc(particle.p.x, particle.p.y, particle.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = particle.color;
      ctx.fill();
      ctx.closePath();
    }
  };

  let config1 = {
    num: [1, 2],
    rps: 0.1,
    radius: [5, 40],
    life: [1.5, 3],
    v: [0.1, 0.3],
    tha: [-40, 40],
    alpha: [0.6, 0],
    scale: [1, 0.1],
    position: "all", 
    color: ["#FFC220"], 
    cross: "dead", 
    random: 5, 
    onParticleUpdate: (ctx, particle) => {
      ctx.beginPath();
      ctx.arc(particle.p.x, particle.p.y, particle.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = particle.color;
      ctx.fill();
      ctx.closePath();
    }
  };
  

  return (
    <div className="login-form-container">

      <form className="login-form" onSubmit={handleLogin}>
      <img className="logo" src="https://sinergiastore.cl/wp-content/uploads/2023/01/LOGO-1-1.png"></img>
        <div>
          <label>Username:</label>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit">Entrar</button>
        <p>
          ¿No tienes cuenta?{' '}
          <button type="button" onClick={onToggleRegister}>
            Regístrate
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
