import React from 'react';
import './Compra.css';

const Compra = ({ onBack }) => {
  return (
    <div className="compra-page">
      <div className="compra-container">
        <h1>¡Gracias por su compra!</h1>
        <p>Su pedido ha sido procesado con éxito.</p>
        <button className="back-button" onClick={onBack}>Volver a productos</button>
      </div>
    </div>
  );
};

export default Compra;
