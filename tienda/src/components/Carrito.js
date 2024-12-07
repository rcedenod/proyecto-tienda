import React, { useState, useEffect } from 'react';
import { getCartItems, deleteCartItem, updateCartItem, getProducts, updateProduct } from '../utils/db.js';
import './Carrito.css';

const Carrito = ({ user, onBack, updateCart, onCheckout }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await getCartItems();
      const allProducts = await getProducts();
      const validProductIds = allProducts.map((product) => product.id);
  
      // Filtra ítems válidos basados en productos existentes
      const validCartItems = items.filter((item) =>
        validProductIds.includes(item.id)
      );
  
      // Si se detectan cambios, sincroniza con la base de datos
      if (validCartItems.length !== items.length) {
        const invalidItems = items.filter(
          (item) => !validProductIds.includes(item.id)
        );
        for (const invalidItem of invalidItems) {
          await deleteCartItem(invalidItem.id);
        }
      }
  
      setCartItems(validCartItems.filter((item) => item.userId === user.id));
      setProducts(allProducts);
    };
  
    fetchCartItems();
  }, [user]);  

  useEffect(() => {
  const syncCartWithInventory = async () => {
    const updatedCartItems = cartItems.filter((item) => {
      const productInDB = products.find((product) => product.id === item.id);
      return productInDB && productInDB.quantity > 0; // Solo mantiene productos con stock
    });

    if (updatedCartItems.length !== cartItems.length) {
      const removedItems = cartItems.filter(
        (item) => !updatedCartItems.some((updated) => updated.id === item.id)
      );
      for (const removedItem of removedItems) {
        await deleteCartItem(removedItem.id); // Elimina los ítems agotados
      }
      setCartItems(updatedCartItems); // Actualiza el estado del carrito
      updateCart(updatedCartItems); // Sincroniza con el estado global
    }
        };
        syncCartWithInventory();
    }, [products, cartItems, updateCart]); // Añade updateCart como dependencia

    useEffect(() => {
        const syncCartWithInventory = async () => {
          const updatedCartItems = cartItems.map((item) => {
            const productInDB = products.find((product) => product.id === item.id);
      
            // Si el producto existe y hay discrepancia, actualizamos los datos del carrito
            if (productInDB) {
              return {
                ...item,
                name: productInDB.name,
                price: productInDB.price,
                image: productInDB.image,
                quantity: Math.min(item.quantity, productInDB.quantity), // Ajustar cantidad si excede el stock
              };
            }
            return item;
          }).filter((item) => products.some((product) => product.id === item.id)); // Filtrar productos eliminados
      
          // Detecta si hubo cambios y sincroniza
          if (JSON.stringify(updatedCartItems) !== JSON.stringify(cartItems)) {
            setCartItems(updatedCartItems); // Actualizar estado del carrito
            updateCart(updatedCartItems); // Actualizar estado global
          }
        };
      
        syncCartWithInventory();
      }, [products, cartItems, updateCart]);
      

  const handleRemove = async (id) => {
    const itemToReset = cartItems.find((item) => item.id === id);
    if (itemToReset) {
      await updateCartItem({ ...itemToReset, quantity: 1 });
    }

    await deleteCartItem(id);
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    updateCart(updatedItems); // Sincroniza con el estado global
  };

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1 || isNaN(newQuantity)) 
        newQuantity = 1; // Evitar cantidades menores a 1

    const item = cartItems.find((item) => item.id === id);
    if (!item) return;
  
    const product = await getProducts(); // Obtén los productos de la base de datos
    const productInDB = product.find((p) => p.id === id);

    if (!productInDB) {
        handleRemove(id); // Eliminar automáticamente si no existe
        return;
    }
  
    if (productInDB && newQuantity > productInDB.quantity) {
      alert(`No puedes añadir más de ${productInDB.quantity} unidades de este producto.`);
      newQuantity = productInDB.quantity; // Limita la cantidad al stock disponible
    }

    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    updateCart(updatedItems);

    // Actualizar en IndexedDB
    const updatedItem = updatedItems.find((item) => item.id === id);
    await updateCartItem(updatedItem);
  };

  const totalCompra = cartItems.reduce((total, item) => {
    const productInDB = products.find((p) => p.id === item.id);
    const itemTotal = productInDB ? item.quantity * productInDB.price : 0;
    return total + itemTotal;
  }, 0);

  const handleCheckout = async () => {
    try {
      // Recorremos los productos del carrito
      for (const item of cartItems) {
        const productInDB = products.find((product) => product.id === item.id);
  
        if (productInDB) {
          const newQuantity = parseInt(productInDB.quantity) - parseInt(item.quantity);
  
          if (newQuantity < 0) {
            alert(`Stock insuficiente para ${productInDB.name}.`);
            return; // Finaliza si hay un error en el stock
          }
  
          // Actualizamos la cantidad del producto en la base de datos
          await updateProduct({ ...productInDB, quantity: newQuantity });
        }
      }
  
      // Limpiamos el carrito en la base de datos
      for (const item of cartItems) {
        await deleteCartItem(item.id);
      }
  
      // Actualizamos el estado del carrito y notificamos al usuario
      setCartItems([]);
      updateCart([]);
  
      // Lógica adicional: regresar a la página de productos o mostrar confirmación
      if (onCheckout) onCheckout();
    } catch (error) {
      console.error("Error durante el checkout:", error);
      alert("Hubo un error al finalizar la compra. Por favor, inténtalo de nuevo.");
    }
  };  

  return (
        <div className="cart-page">
          <div className="cart-header">
            <button onClick={onBack} className="back-button">Volver</button>
            <h1 className='tucarrito'>Tu Carrito</h1>
            <img className="logo" src="https://sinergiastore.cl/wp-content/uploads/2023/01/LOGO-1-1.png"></img>
          </div>
            {cartItems.length === 0 ? (
            <p>No tienes productos en el carrito.</p>
            ) : (
            <div className='lista-carrito'>
              <ul className="cart-list">
                {cartItems.map((item) => {
                  const productInDB = products.find((p) => p.id === item.id);
                  const maxQuantity = productInDB?.quantity || 1;
                  const productTotal = productInDB ? item.quantity * productInDB.price : 0;
    
                  return (
                    <li key={item.id} className="cart-item">
                      <img
                        src={item.image || '../public/default-placeholder.png'}
                        alt={item.name}
                      />
                      <div>
                        <h3>{item.name}</h3>
                        <p>Precio: ${item.price}</p>
                        <p>Total: ${productTotal.toFixed(2)}</p>
                        <div className="quantity-controls">
                          <label>Cantidad:</label>
                          <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            max={maxQuantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, parseInt(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      <button onClick={() => handleRemove(item.id)}>Eliminar</button>
                    </li>
                  );
                })}
              </ul>
              <div className='piecarrito'>
              <div className="cart-total">
                <h3>Total de la compra: ${totalCompra.toFixed(2)}</h3>
              </div>
              <button className="finalizar-compra" onClick={handleCheckout}>
                Finalizar Compra
              </button>
                </div>
            </div>
            )}
        </div>
      );
    };

export default Carrito;
