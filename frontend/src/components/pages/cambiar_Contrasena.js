import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import Header from '../common/header';
import Footer from '../common/footer';

const CambiarContrasena = () => {
  const { userId } = useParams(); // Obtener el ID del usuario desde los parámetros de la URL
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // Añadir estado de error
  const [success, setSuccess] = useState(null); // Añadir estado de éxito
  const URL = 'https://tienditadelabuelo.postgres.database.azure.com';
  const url2 = 'http://localhost:3080';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(url2+'/usuarios/'+userId);
        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (user.contrasena !== formData.oldPassword) {
      setError('La contraseña actual no es correcta');
      return;
    }

    try {
      const response = await fetch(url2+'/usuarios/'+userId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...user, contrasena: formData.newPassword })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cambiar la contraseña');
      }

      setSuccess('Contraseña cambiada exitosamente');
      setError(null);
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Cambiar Contraseña
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: '400px', mx: 'auto', mt: 2 }}
          >
            <TextField
              label="Contraseña actual"
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nueva contraseña"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Confirmar nueva contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            {error && (
              <Typography color="error" variant="body2" gutterBottom sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="primary" variant="body2" gutterBottom sx={{ mt: 1 }}>
                {success}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Cambiar Contraseña
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default CambiarContrasena;
