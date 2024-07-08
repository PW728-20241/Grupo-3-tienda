import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../common/header';
import Footer from '../common/footer';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3080/usuario2/${userId}`);
      const userData = await response.json();
      console.log('Usuario encontrado:', userData);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3080/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo: email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.message || 'Error al enviar el correo');
        return;
      }

      const userData = await response.json();
      await fetchUser(userData.id);

      setEmailSent(true);
    } catch (error) {
      console.log('Error en el servidor');
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Ingrese su correo para recuperar contraseña
          </Typography>
          {!emailSent ? (
            <form onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                label="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Enviar
              </Button>
            </form>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Se ha enviado un correo electrónico para restablecer tu contraseña.
            </Typography>
          )}
          <Box sx={{ mt: 2 }}>
            <Link href="#" variant="body2" onClick={() => navigate('/LoginPage')}>
              Regresar a Login
            </Link>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default ForgotPasswordPage;
