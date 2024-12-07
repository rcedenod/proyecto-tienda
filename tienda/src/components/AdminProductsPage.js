import React, { useState, useEffect, useCallback } from 'react';
import './AdminProductsPage.css';
import { addProduct, getProducts, initDB, deleteProduct, updateProduct } from '../utils/db.js';
import AddProductPopup from './AddProductPopup';
import { FaPlus } from 'react-icons/fa';

const AdminProductsPage = ({ onBack, user, onProductChange }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    category: '',
    priceRange: { min: '', max: '' },
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    author: user?.username || 'Desconocido',
    category: '',
    image: '',
    dateCreated: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      await initDB();
      const dbProducts = await getProducts();
      setProducts(dbProducts);
      setFilteredProducts(dbProducts);
    };
    fetchProducts();
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...products];

    if (filters.search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.date) {
      filtered = filtered.filter((product) => product.dateCreated === filters.date);
    }

    if (filters.category) {
      filtered = filtered.filter((product) => product.category === filters.category);
    }

    if (filters.priceRange.min || filters.priceRange.max) {
      const min = parseFloat(filters.priceRange.min) || 0;
      const max = parseFloat(filters.priceRange.max) || Infinity;
      filtered = filtered.filter((product) => product.price >= min && product.price <= max);
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  useEffect(() => {
    applyFilters();
  }, [filters, products, applyFilters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddOrUpdateProduct = async () => {
    const { name, price, quantity, description, category, image } = newProduct;

    if (!name || !price || !description || !category || !image) {
      alert('Todos los campos son obligatorios. Por favor, completa todos los campos.');
      return;
    }

    if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity < 0) {
      alert('Por favor, ingresa valores numéricos válidos para el precio y la cantidad.');
      return;
    }

    const productWithDefaults = {
      ...newProduct,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
    };

    if (editingProductId) {
      await updateProduct({ ...productWithDefaults, id: editingProductId });
    } else {
      await addProduct(productWithDefaults);
    }

    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
    resetPopupState();
    onProductChange(updatedProducts);
  };

  const resetPopupState = () => {
    setNewProduct({
      name: '',
      price: '',
      quantity: '',
      description: '',
      author: user?.username || 'Desconocido',
      category: '',
      image: '',
      dateCreated: new Date().toISOString().split('T')[0],
    });
    setEditingProductId(null);
    setIsPopupOpen(false);
  };

  const handleEditProduct = (product) => {
    setNewProduct(product);
    setEditingProductId(product.id);
    setIsPopupOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
    onProductChange(updatedProducts);
  };

  const truncateDescription = (description) => {
    if (description.length > 30) {
      return description.substring(0, 25) + "...";
    }
    return description;
  };

  return (
    <div className="admin-products-page">
      
      <header>
        <button onClick={onBack}>Volver</button>
        <img className="logo" src="https://sinergiastore.cl/wp-content/uploads/2023/01/LOGO-1-1.png"></img>
        <h1>Gestor de productos</h1>
      </header>

      <div className="content-container">
        <aside className="sidebar">
        <span className="search-span">
                BUSCAR PRODUCTO
              </span>

              <div className="filter-group">
                <input
                  type="text"
                  placeholder="Buscar producto"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              <hr className="separator"></hr>

              <span className="filter-date-span">
                FILTRAR POR FECHA
              </span>

              <div className="filter-group">
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                />
              </div>

              <hr className="separator"></hr>

              <span className="filter-select-span">
                FILTRAR POR CATEGORIA
              </span>

                <select
                className="filter-select"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {[...new Set(products.map((p) => p.category))].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              <hr className="separator"></hr>

              <span className="price-filters-span">
                FILTRAR POR PRECIO
              </span>

              <div className="price-filters">
                <input
                  type="number"
                  placeholder="Mínimo"
                  min="0"
                  step="1"
                  value={filters.priceRange.min}
                  onChange={(e) =>
                    handleFilterChange('priceRange', {
                      ...filters.priceRange,
                      min: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  min="0"
                  step="1"
                  value={filters.priceRange.max}
                  onChange={(e) =>
                    handleFilterChange('priceRange', {
                      ...filters.priceRange,
                      max: e.target.value,
                    })
                  }
                />
              </div>

              <hr className="separator"></hr>
            <div className="center-button">
            <button className="add-product-button" onClick={() => setIsPopupOpen(true)}>
              <FaPlus style={{ marginRight: '8px' }} />
              Añadir Producto
            </button>
          </div>

        </aside>

          <div className="product-list">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card-admin">
              <img
                src={product.image || '../public/default-placeholder.png'}
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/default-placeholder.png';
                }}
              />
              <h3>{product.name}</h3>
              <p>{truncateDescription(product.description)}</p>
              <p>Precio: ${product.price}</p>
              <p>Categoría: {product.category}</p>
              <p>Cantidad: {product.quantity}</p>
              {/* <p>Proveedor: {product.proveedor}</p> */}
              <p>Creado por: {product.author}</p>
              <p>Fecha: {product.dateCreated}</p>
              <button onClick={() => handleEditProduct(product)}>Editar</button>
              <button className='eliminar-button' onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
            </div>
          ))}
          </div>
      </div>

      {isPopupOpen && (
        <AddProductPopup
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          onSaveProduct={handleAddOrUpdateProduct}
          onClose={resetPopupState}
          isEditing={!!editingProductId}
        />
      )}

    </div>
  );
};

export default AdminProductsPage;
