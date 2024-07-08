import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ProductDialog from './ProductDialog';

export default function AgregarSerie() {
  const location = useLocation();
  const navigate = useNavigate();
  const { serie } = location.state || {};
  const [nombre, setNombre] = useState(serie?.nombre || '');
  const [descripcion, setDescripcion] = useState(serie?.descripcion || '');
  const [productos, setProductos] = useState(serie?.productos || []);
  const [open, setOpen] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const URL = 'https://tienditadelabuelo.postgres.database.azure.com';
  const url2 = 'http://localhost:3080';

  useEffect(() => {
    if (serie && serie.id) {
      fetchSeriesProducts(serie.id);
    }
    fetchAllProducts();
  }, [serie]);

  const fetchSeriesProducts = async (serieId) => {
    try {
      const response = await fetch(url2+'/admin/series/'+serieId);
      const data = await response.json();
      setNombre(data.nombre);
      setDescripcion(data.descripcion);
      setProductos(data.Productos || []);
    } catch (error) {
      console.error('Error al obtener la serie:', error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(url2+'/admin/productos');
      const data = await response.json();
      setAvailableProducts(data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const handleAddProduct = () => {
    setOpen(true);
  };

  const handleRemoveProduct = async (product) => {
    try {
      if (serie && serie.id) {
        await fetch(url2+'/admin/series/'+serie.id+'/productos/'+product.id, {
          method: 'DELETE'
        });
      }
      setProductos(productos.filter(p => p.id !== product.id));
    } catch (error) {
      console.error('Error al remover el producto:', error);
    }
  };

  const handleGuardarClick = async () => {
    const serieData = {
      nombre,
      descripcion,
      productos: productos.map(p => p.id)
    };

    try {
      if (serie && serie.id) {
        await fetch(url2+'/admin/series/'+serie.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(serieData)
        });
      } else {
        await fetch(url2+'/admin/series', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(serieData)
        });
      }
      navigate('/admin/series');
    } catch (error) {
      console.error('Error al guardar la serie:', error);
    }
  };

  const handleAddToSerie = async (product) => {
    try {
      if (serie && serie.id) {
        await fetch(url2+'/admin/series/'+serie.id+'/productos/'+product.id, {
          method: 'POST'
        });
      }
      setProductos([...productos, product]);
      setOpen(false);
    } catch (error) {
      console.error('Error al agregar el producto a la serie:', error);
    }
  };

  return (
    <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h5" gutterBottom>Agregar Serie</Typography>
      <Box sx={{ display: 'flex', gap: '20px' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" gutterBottom>Agregar Serie</Typography>
          <Box sx={{ border: '1px solid #ccc', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="caption">Imagen Placeholder</Typography>
          </Box>
          <Button variant="contained" component="label" sx={{ marginTop: '10px' }}>
            Agregar Imagen
            <input type="file" hidden />
          </Button>
        </Box>
        <Box sx={{ flex: 2 }}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{ marginBottom: '10px' }}
          />
          <Typography variant="h6" gutterBottom>Productos en la serie</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>{producto.id}</TableCell>
                    <TableCell>{producto.descripcion}</TableCell>
                    <TableCell>
                      <Button color="secondary" onClick={() => handleRemoveProduct(producto)}>Remover</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <IconButton onClick={handleAddProduct} color="primary">
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleGuardarClick}>Guardar</Button>
      </Box>

      <ProductDialog
        open={open}
        onClose={() => setOpen(false)}
        onAddProduct={handleAddToSerie}
        availableProducts={availableProducts}
        serie={serie}
      />
    </Box>
  );
}
