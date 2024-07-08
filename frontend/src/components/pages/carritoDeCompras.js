import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, FormControl, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../common/header';
import Footer from '../common/footer';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const storedSavedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    setCartItems(storedCartItems);
    setSavedItems(storedSavedItems);
  }, []);

  const handleQuantityChange = (id, quantity) => {
    const updatedItems = cartItems.map(item => item.id === id ? { ...item, cantidad: quantity } : item);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const handleRemoveItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const handleMoveToSaved = (id) => {
    const itemToMove = cartItems.find(item => item.id === id);
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
    setSavedItems([...savedItems, itemToMove]);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    localStorage.setItem('savedItems', JSON.stringify([...savedItems, itemToMove]));
  };

  const handleMoveToCart = (id) => {
    const itemToMove = savedItems.find(item => item.id === id);
    const updatedSavedItems = savedItems.filter(item => item.id !== id);
    setSavedItems(updatedSavedItems);
    setCartItems([...cartItems, itemToMove]);
    localStorage.setItem('cartItems', JSON.stringify([...cartItems, itemToMove]));
    localStorage.setItem('savedItems', JSON.stringify(updatedSavedItems));
  };

  const handleCheckout = () => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    navigate('/checkout');
  };

  return (
    <>
      <Header />
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>{cartItems.length} Items en tu Carrito de Compras</Typography>
        {cartItems.length === 0 ? (
          <Typography>No hay productos en el carrito.</Typography>
        ) : (
          <>
            {cartItems.map(item => (
              <Box key={item.id} sx={{ backgroundColor: '#f5f5f5', padding: 2, borderRadius: 1, mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid #ccc', paddingBottom: 1 }}>{item.nombre}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', padding: 2, borderBottom: '1px solid #ddd' }}>
                  <Box sx={{ width: 80, height: 80, backgroundColor: '#eee', mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>{item.nombre}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button variant="text" onClick={() => handleRemoveItem(item.id)}>Eliminar</Button>
                      <Button variant="text" onClick={() => handleMoveToSaved(item.id)}>Guardar para después</Button>
                    </Box>
                  </Box>
                  <FormControl size="small" sx={{ width: '60px', mr: 2 }}>
                    <Select
                      value={item.cantidad}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      displayEmpty
                    >
                      {[1, 2, 3, 4, 5].map((x) => (
                        <MenuItem key={x} value={x}>{x}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography sx={{ width: '80px', textAlign: 'right' }}>Precio: S/{(item.precio || 0).toFixed(2)}</Typography>
                  <Typography sx={{ width: '80px', textAlign: 'right' }}>Subtotal: S/ {((item.cantidad * (item.precio || 0)).toFixed(2))}</Typography>
                </Box>
              </Box>
            ))}
            <Box sx={{ textAlign: 'right', padding: 2, borderTop: '1px solid #ddd', mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Total: S/ {cartItems.reduce((acc, item) => acc + item.cantidad * item.precio, 0).toFixed(2)}</Typography>
              <Button variant="contained" onClick={handleCheckout} color="primary">Checkout</Button>
            </Box>
          </>
        )}
        
        <Typography variant="h5" sx={{ mb: 3, mt: 5 }}>{savedItems.length} Items Guardados para Después</Typography>
        {savedItems.length === 0 ? (
          <Typography>No hay productos guardados para después.</Typography>
        ) : (
          <>
            {savedItems.map(item => (
              <Box key={item.id} sx={{ backgroundColor: '#f5f5f5', padding: 2, borderRadius: 1, mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid #ccc', paddingBottom: 1 }}>{item.nombre}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', padding: 2, borderBottom: '1px solid #ddd' }}>
                  <Box sx={{ width: 80, height: 80, backgroundColor: '#eee', mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>{item.nombre}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button variant="text" onClick={() => handleRemoveItem(item.id)}>Eliminar</Button>
                      <Button variant="text" onClick={() => handleMoveToCart(item.id)}>Mover al carrito</Button>
                    </Box>
                  </Box>
                  <Typography sx={{ width: '80px', textAlign: 'right' }}>Precio: S/{(item.precio || 0).toFixed(2)}</Typography>
                </Box>
              </Box>
            ))}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default CartPage;
