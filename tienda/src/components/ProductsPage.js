import React, { useState, useEffect } from 'react';
import { getProducts, addToCartInDB, getCartItems, updateCartItem } from '../utils/db.js'; 
import AdminProductsPage from './AdminProductsPage'; 
import { FaShoppingCart } from 'react-icons/fa';
import ProductPopup from './ProductPopup';
import Carrito from './Carrito.js';
import Compra from './Compra.js';
import './ProductsPage.css';

const ProductsPage = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState('products'); // Estado para controlar la vista
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para el producto seleccionado


  // Estados para los filtros
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const dbProducts = await getProducts();
      setProducts(dbProducts);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await getCartItems();
      setCartItems(items.filter(item => item.userId === user.id)); // Filtra por usuario
    };
    fetchCartItems();
  }, [user]);
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const updateCart = (updatedItems) => {
    setCartItems(updatedItems);
  };  

  const addToCart = async (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id && item.userId === user.id);
  
    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > product.quantity) {
        alert(`No puedes añadir más de ${product.quantity} unidades de este producto.`);
        return;
      }
      const updatedItem = { ...existingItem, quantity: newQuantity };
      await updateCartItem(updatedItem);
      setCartItems((prev) =>
        prev.map((item) => (item.id === product.id ? updatedItem : item))
      );
    } else {
      if (product.quantity < 1) {
        alert("Este producto no tiene stock disponible.");
        return;
      }
      const newItem = { ...product, userId: user.id, quantity: 1 };
      await addToCartInDB(newItem);
      setCartItems((prev) => [...prev, newItem]);
    }
  };

  const precio = (precio) => {
    if (precio > 1000000)
      return "1.000.000";
    else
      return precio;
  };

  // Productos filtrados
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? product.category === category : true;
    const matchesMinPrice = minPrice ? product.price >= parseFloat(minPrice) : true;
    const matchesMaxPrice = maxPrice ? product.price <= parseFloat(maxPrice) : true;
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const handleProductChange = (updatedProducts) => {
    setProducts(updatedProducts);
  };

const handleBackToProducts = () => {
  setView('products');
};

const handleUpdateProducts = async () => {
  const updatedProducts = await getProducts();
  setProducts(updatedProducts); // Actualiza el estado de los productos
  setView('checkout');
};

return view === 'products' ? (
    <div className="products-page">
    <header className="navbar">
      <img className="logo" src="https://sinergiastore.cl/wp-content/uploads/2023/01/LOGO-1-1.png"></img>

      {/* Controles de filtros */}
      <input
        type="text"
        className="search-bar"
        placeholder="Buscar producto"
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="user-profile">
        <span
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="user-name"
        >
          {user?.username}
        </span>
        {isMenuOpen && (
          <div className="dropdown-menu">
            {user?.role === 'admin' && (
              <button onClick={() => setView('admin-products')}>Editar productos</button>
            )}
            <button onClick={onLogout}>Cerrar sesión</button>
          </div>
        )}
      </div>
      <div className="cart">
        <button className="cart-button" onClick={() => setView('cart')}>
          <FaShoppingCart size={20} style={{ marginRight: '5px' }} />
          ({cartItems.length})
        </button>
      </div>
    </header>

    {/* Contenedor para la barra lateral y la lista de productos */}
    <div className="content-container">
      <aside className="sidebar">

        <span className="filter-select-span">
          FILTRAR POR CATEGORIA
        </span>

        <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
              className="filter-input"
              placeholder="Mínimo"
              min="0"
              step="1"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              className="filter-input"
              placeholder="Máximo"
              min="0"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
      </aside>

      <main className="product-list">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => setSelectedProduct(product)}
          >
            <img
              src={product.image || '../public/default-placeholder.png'}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.src = '/default-placeholder.png';
              }}
            />
            <h3>{product.name}</h3>
            <p>Precio: ${precio(product.price)}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              disabled={product.quantity === 0}
              className={product.quantity === 0 ? 'disabled-button' : 'add-to-cart-button'}
            >
              {product.quantity === 0 ? 'Agotado' : 'Agregar al carrito'}
            </button>
          </div>
        ))}
      </main>
    </div>

    {selectedProduct && (
      <ProductPopup
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
    )}
  </div>


) : view === 'cart' ? (
  <Carrito user={user} onBack={() => setView('products')} updateCart={updateCart} updatedProducts={products} onProductChange={handleProductChange} onCheckout={handleUpdateProducts}/>
) : view === 'checkout' ? (
  <Compra onBack={handleBackToProducts}/>
) : (
  <AdminProductsPage
    user={user}
    onBack={() => setView('products')}
    onProductChange={handleProductChange}
  />
);
}

export default ProductsPage;
