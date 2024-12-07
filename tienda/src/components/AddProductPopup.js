import React from 'react';
import './AddProductPopup.css';

const AddProductPopup = ({ newProduct, setNewProduct, onSaveProduct, onClose, isEditing }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Nombre del producto:</label>
            <input
              type="text"
              id="name"
              value={newProduct.name}
              maxLength={50}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Precio:</label>
            <input
              type="number"
              id="price"
              value={newProduct.price}
              min="0"
              max="1000000"
              step="1"
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Cantidad:</label>
            <input
              type="number"
              id="quantity"
              value={newProduct.quantity}
              min="0"
              max="1000000"
              step="1"
              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción:</label>
            <textarea
              id="description"
              value={newProduct.description}
              maxLength={350}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
          </div>
          {/* <div className="form-group">
            <label htmlFor="proveedor">Proveedor:</label>
            <input
              type="text"
              id="proveedor"
              placeholder="Ejemplo: Proveedores ABC"
              value={newProduct.proveedor}
              maxLength={25}
              onChange={(e) => setNewProduct({ ...newProduct, proveedor: e.target.value })}
            />
          </div> */}
          <div className="form-group">
            <label htmlFor="category">Categoría:</label>
            <input
              type="text"
              id="category"
              value={newProduct.category}
              maxLength={25}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">URL de la Imagen:</label>
            <input
              type="text"
              id="image"
              placeholder="Ejemplo: https://example.com/imagen.jpg"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            />
          </div>
        </form>
        <div className="popup-buttons">
          <button onClick={onSaveProduct}>{isEditing ? 'Guardar' : 'Agregar'}</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPopup;
