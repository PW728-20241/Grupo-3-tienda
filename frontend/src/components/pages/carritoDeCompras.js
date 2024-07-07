import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, FormControl, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../common/header';
import Footer from '../common/footer';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
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

  const handleCheckout = () => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    navigate('/checkout');
  };

  const productoToAdd = JSON.parse(localStorage.getItem('productoToAdd'));

  return (
    <>
      <Header/>
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>{cartItems.length} Items en tu Carrito de Compras</Typography>
        {cartItems.length === 0 ? (
          <Typography>No hay productos en el carrito.</Typography>
        ) : (
          <>
            <Box sx={{ backgroundColor: '#f5f5f5', padding: 2, borderRadius: 1, mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid #ccc', paddingBottom: 1 }}>Items Disponibles para Envío</Typography>
              <Box key={productoToAdd.id} sx={{ display: 'flex', alignItems: 'center', padding: 2, borderBottom: '1px solid #ddd' }}>
                <Box sx={{ width: 80, height: 80, backgroundColor: '#eee', mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography>{productoToAdd.nombre}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="text" onClick={() => handleRemoveItem(productoToAdd.id)}>Eliminar</Button>
                  </Box>
                </Box>
                <FormControl size="small" sx={{ width: '60px', mr: 2 }}>
                  <Select
                    value={productoToAdd.cantidad}
                    onChange={(e) => handleQuantityChange(productoToAdd.id, e.target.value)}
                    displayEmpty
                  >
                    {[1, 2, 3, 4, 5].map((x) => (
                      <MenuItem key={x} value={x}>{x}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography sx={{ width: '80px', textAlign: 'right' }}>Precio: S/{(productoToAdd.precio || 0).toFixed(2)}</Typography>
                <Typography sx={{ width: '80px', textAlign: 'right' }}>Subtotal: S/ {((productoToAdd.cantidad * (productoToAdd.precio || 0)).toFixed(2))}</Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right', padding: 2, borderTop: '1px solid #ddd', mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Total: S/ {(productoToAdd.cantidad * (productoToAdd.precio || 0)).toFixed(2)}</Typography>
              <Button variant="contained" onClick={handleCheckout} color="primary">Checkout</Button>
            </Box>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default CartPage;
