import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useNavigate, useLocation } from 'react-router-dom';

const DetailsBox = () => {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state.id;
  const [producto, setProducto] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3080/admin/productos/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setProducto(data);
    };
    fetchData();
  }, [id]);

  const handleDecrement = () => {
    setCount(prevCount => Math.max(prevCount - 1, 0));
  };

  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1);
  };

  const addToCart = () => {
    const productoToAdd = {
      nombre: producto.nombre,
      cantidad: count,
      precio: producto.precio
    };
    localStorage.setItem('productoToAdd', JSON.stringify(productoToAdd));
    navigate('/carritoDeCompras');
  };

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Box
        sx={{
          width: '60%',
          minHeight: '70vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          pt: 2,
          border: '2px solid gray',
          ml: 8,
          borderRadius: 2,
          backgroundImage: `url(${producto.img})`, // Asegúrate de tener la propiedad img en tu objeto producto
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <Box
        sx={{
          width: '25%',
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
          mx: 8
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '10%',
            border: '2px solid gray',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h4">DISPONIBLE</Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: 'lightgray',
            border: '2px solid gray',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            pt: 2
          }}
        >
          <Stack direction="column" spacing={8} alignItems={'center'}>
            <Typography variant="h3" fontWeight="bold">S/{producto.precio}</Typography>
            <Button
              variant="contained"
              sx={{ width: '200px', height: '150px', fontSize: '20px' }}
              onClick={addToCart}
            >
              AÑADIR AL CARRITO
            </Button>
            <Typography variant="h4" fontWeight="bold">Cantidad:</Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Button
                variant="text"
                onClick={handleDecrement}
                sx={{ width: '40px', height: '40px', marginRight: '10px', fontSize: '20px' }}
              >
                -
              </Button>
              <Typography variant="h6" sx={{ minWidth: '30px', textAlign: 'center' }}>
                {count}
              </Typography>
              <Button
                variant="text"
                onClick={handleIncrement}
                sx={{ width: '40px', height: '40px', marginLeft: '10px', fontSize: '20px' }}
              >
                +
              </Button>
            </Box>
            <Link href="#" variant="h4" sx={{ color: 'black', textDecorationColor: 'black', pt: '20px' }}>
              Ver métodos disponibles
            </Link>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};

export default DetailsBox;
