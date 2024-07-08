import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../common/header';
import Footer from '../common/footer';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });
  const [mensajeError, setMensajeError] = useState('');
  const [mostrarOpciones, setMostrarOpciones] = useState(true);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setMostrarOpciones(true);
  };

  const fetchUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3080/usuario2/${userId}`);
      const userData = await response.json();
      console.log('Usuario autenticado:', userData);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { correo, password } = formData;

    try {
      const response = await fetch('http://localhost:3080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMensajeError(errorData.message || 'Error en la autenticación');
        setMostrarOpciones(false);
        return;
      }

      const data = await response.json();
      await fetchUser(data.id);

      setFormData({
        correo: '',
        password: ''
      });
      setMensajeError('');
      navigate(`/pantalla-principal/${data.id}`);
    } catch (error) {
      setMensajeError('Error en el servidor');
      setMostrarOpciones(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Ingreso para clientes registrados
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: '400px', mx: 'auto', mt: 2 }}
          >
            <TextField
              label="email"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            {mensajeError && (
              <Typography color="error" variant="body2" gutterBottom sx={{ mt: 1 }}>
                {mensajeError}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Ingresar
            </Button>
            {mostrarOpciones && (
              <Box sx={{ mt: 2 }}>
                <Link href="#" variant="body2" onClick={() => navigate('/perdida-contra')}>
                  Olvidé mi contraseña
                </Link>
                <Link href="#" variant="body2" sx={{ ml: 1 }} onClick={() => navigate('/crear-cuenta')}>
                  No tengo cuenta, deseo registrarme
                </Link>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default LoginPage;
