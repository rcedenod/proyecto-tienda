import { openDB } from 'idb';

const DB_NAME = 'Tienda1';
const DB_VERSION = 1;

// Inicializa la base de datos
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('cart')) {
        db.createObjectStore('cart', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

// Funciones para usuarios
export const addUser = async (user) => {
  const db = await initDB();
  return db.add('users', user);
};

export const getUsers = async () => {
  const db = await initDB();
  return db.getAll('users');
};

// Funciones para productos
export const addProduct = async (product) => {
  const db = await initDB();
  return db.add('products', product);
};

export const getProducts = async () => {
  const db = await initDB();
  return db.getAll('products');
};

export const deleteProduct = async (id) => {
  const db = await initDB();
  return db.delete('products', id);
};

export const updateProduct = async (product) => {
  const db = await initDB();
  return db.put('products', product);
};


// Funciones para el carrito
export const addToCartInDB = async (item) => {
  const db = await initDB();
  return db.add('cart', item);
};

export const getCartItems = async () => {
  const db = await initDB();
  return db.getAll('cart');
};

// Actualiza un producto en el carrito
export const updateCartItem = async (item) => {
  const db = await initDB();
  return db.put('cart', item);
};

// Elimina un producto del carrito
export const deleteCartItem = async (id) => {
  const db = await initDB();
  return db.delete('cart', id);
};
