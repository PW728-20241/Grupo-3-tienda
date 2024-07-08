import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Stack, Radio, RadioGroup, FormControlLabel, FormControl, Button } from '@mui/material';
import Header from '../common/header';
import Footer from '../common/footer';

const OrdenesUsuario = () => {
  const { userId } = useParams(); // Obtener el ID del usuario desde los parámetros de la URL
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError] = useState(null);
  const URL = 'https://tienditadelabuelo.postgres.database.azure.com';
  const url2 = 'http://localhost:3080';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(url2+'/usuarios/'+userId+'/ordenes');
        if (!response.ok) {
          throw new Error('Error al obtener las órdenes');
        }
        const data = await response.json();
        setOrdenes(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchOrders();
  }, [userId]);

  if (error) {
    return (
      <>
        <Container>
          <Typography variant="h6" color="error">{error}</Typography>
        </Container>
      </>
    );
  }

  if (!ordenes || ordenes.length === 0) {
    return (
      <>
        <Container>
          <Typography variant="h6">No hay órdenes disponibles</Typography>
        </Container>
      </>
    );
  }

  const handleCancelOrder = async (id) => {
    try {
      const response = await fetch(url2+'/admin/ordenes/'+id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al cancelar la orden');
      }
      setOrdenes(ordenes.filter((orden) => orden.id !== id));
    } catch (error) {
      setError('Hubo un error al cancelar la orden');
    }
  };

  return (
    <>
      <Container>
        {ordenes.map((orden) => (
          <Box key={orden.id} sx={{ display: 'flex', flexDirection: 'column', height: '76vh', mb: 4, marginBottom: "30px", justifyContent: "center" }}>
            <Stack direction="column" justifyContent="flex-start" paddingLeft="1vw">
              <Typography variant="h6" component="div" sx={{ paddingTop: "15px", paddingBottom: "15px" }}>
                Detalles de Orden 
              </Typography>
              <Box sx={{
                paddingBottom: "8px",
                paddingTop: "8px",
                backgroundColor: '#E7E3E3',
                width: '58vw',
                height: '4vh',
                alignContent: 'center',
                border: '1px grey solid',
                paddingLeft: "1vw"
              }}><b>Datos de Compras</b></Box>
              <Box sx={{
                paddingBottom: "8px",
                paddingTop: "8px",
                width: '77vw'
              }}></Box>
              <Stack direction="row" justifyContent="space-between" sx={{ flexGrow: 1 }}>
                <Box sx={{
                  paddingBottom: "8px",
                  paddingTop: "8px",
                  backgroundColor: 'skyblue',
                  paddingLeft: "2vw",
                  width: '36vw',
                  height: '20vh',
                }}>
                  <p><b>Direccion de envio</b></p>
                  <p>{orden.direccion}</p>
                </Box>
                <Box sx={{
                  paddingBottom: "8px",
                  paddingTop: "8px",
                  backgroundColor: 'skyblue',
                  paddingLeft: "2vw",
                  width: '36vw',
                  height: '20vh',
                  alignContent: 'center'
                }}>
                  <p><b>Pago</b></p>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="radio-buttons-group"
                      defaultValue={orden.metPago}
                    >
                      <FormControlLabel value="QR" control={<Radio disabled />} label="Pago con QR" />
                      <FormControlLabel value="Tarjeta" control={<Radio disabled />} label="Pago con tarjeta de credito" />
                    </RadioGroup>
                  </FormControl>
                  <Stack direction="row" justifyContent="space-between">
                    <p>Tarjeta de Credito que termina en: {orden.nroTarjeta}</p>
                  </Stack>  
                </Box>
              </Stack>
              <Box sx={{
                paddingBottom: "8px",
                paddingTop: "8px",
                width: '77vw'
              }}></Box>
              <Box sx={{
                paddingBottom: "8px",
                paddingTop: "8px",
                backgroundColor: '#E7E3E3',
                width: '58vw',
                height: '4vh',
                alignContent: 'center',
                border: '1px grey solid',
                paddingLeft: "1vw"
              }}><b>Metodos de Envio</b></Box>
              <Box sx={{
                paddingBottom: "8px",
                paddingTop: "8px",
                width: '77vw'
              }}></Box>
              <Box sx={{
                paddingBottom: "8px",
                paddingTop: "8px",
                backgroundColor: 'skyblue',
                paddingLeft: "2vw",
                width: '57vw',
                height: '5vh',
                alignContent: 'center',
              }}>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="radio-buttons-group"
                    defaultValue={orden.envio}
                  ><Stack direction="row">
                    <FormControlLabel value="Economico" control={<Radio disabled />} label="Economico Aereo - S/10" />
                    <FormControlLabel value="Prioritario" control={<Radio disabled />} label="Envio Prioritario (5 a 10 dias) - S/17" />
                  </Stack></RadioGroup>
                </FormControl>
              </Box>
              <Box sx={{
                paddingBottom: "8px",
                paddingTop: "8px",
                width: '77vw'
              }}></Box>
              <Stack direction="row" justifyContent="space-between" sx={{ flexGrow: 1 }}>
                <Box sx={{
                  paddingBottom: "8px",
                  paddingTop: "8px",
                  backgroundColor: 'skyblue',
                  paddingLeft: "2vw",
                  width: '36vw',
                  height: '25vh'
                }}>
                  <p><b>Items en pedidos</b></p>
                  <ul>
                    {orden.productos && orden.productos.map((prod) => (
                      <li key={prod.id}>{prod.Producto.stock}{" x "}{prod.Producto.detalle}</li>
                    ))}
                  </ul>
                </Box>
                <Box sx={{
                  paddingBottom: "8px",
                  paddingTop: "8px",
                  backgroundColor: 'skyblue',
                  paddingLeft: "2vw",
                  width: '36vw',
                  height: '25vh'
                }}>
                  <p><b>Resumen del pedido</b></p>
                  <p>SubTotal: S/{orden.SubTotal}</p>
                  <p>Envio: S/{orden.envio === "Economico" ? 10 : 17}</p>
                  <p>Impuestos: S/18</p>
                  <p>Total: S/{orden.Total}</p>
                  <center><Button variant="contained" onClick={() => handleCancelOrder(orden.id)}>Cancelar Pedido</Button></center>
                </Box>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Container>
    </>
  );
};

export default OrdenesUsuario;
