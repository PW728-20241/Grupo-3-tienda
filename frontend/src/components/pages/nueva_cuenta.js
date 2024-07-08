import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../common/header';
import Footer from '../common/footer';

const NuevaCuenta = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    confirmarPassword: ''
  });
  const [mensajeError, setMensajeError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const fetchUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3080/user/${userId}`);
      const userData = await response.json();
      console.log('Usuario registrado:', userData);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { nombre, apellido, correo, password, confirmarPassword } = formData;

    if (password !== confirmarPassword) {
      setMensajeError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:3080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, apellido, correo, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMensajeError(errorData.message || 'Error al crear la cuenta');
        return;
      }

      const userData = await response.json();
      await fetchUser(userData.id);

      setFormData({
        nombre: '',
        apellido: '',
        correo: '',
        password: '',
        confirmarPassword: ''
      });
      setMensajeError('');
      navigate('/LoginPage');
    } catch (error) {
      setMensajeError('Error en el servidor');
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Registrar una nueva cuenta
          </Typography>
          {mensajeError && <Typography color="error">{mensajeError}</Typography>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: '400px', mx: 'auto', mt: 2 }}
          >
            <TextField
              label="Nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Apellido"
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Correo electrónico"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Confirmar Contraseña"
              type="password"
              name="confirmarPassword"
              value={formData.confirmarPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Crear nueva cuenta
            </Button>
            <Box sx={{ mt: 2 }}>
              <Link href="#" variant="body2" onClick={() => navigate('/LoginPage')}>
                Regresar a Login
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default NuevaCuenta;
