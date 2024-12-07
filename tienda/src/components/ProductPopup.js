import React from 'react';
import './ProductPopup.css';

const ProductPopup = ({ product, onClose, onAddToCart }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <img
          src={product.image || '../public/default-placeholder.png'}
          alt={product.name}
          className="popup-image"
          onError={(e) => { e.target.src = '/default-placeholder.png'; }}
        />
        <h2>{product.name}</h2>
        <p><strong>Descripción:</strong> {product.description}</p>
        <p><strong>Precio:</strong> ${product.price}</p>
        <p><strong>Categoría:</strong> {product.category}</p>
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.quantity === 0}
          className={product.quantity === 0 ? 'disabled-button' : 'add-to-cart-button'}
        >
          {product.quantity === 0 ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
};

export default ProductPopup;
