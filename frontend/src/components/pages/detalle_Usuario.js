import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
  import Header from '../common/header';
  import Footer from '../common/footer';

const DetalleUsuario = () => {
  const { userId } = useParams(); // Obtener el ID del usuario desde los parámetros de la URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Añadir estado de carga
  const [error, setError] = useState(null); // Añadir estado de error
  const [isEditing, setIsEditing] = useState(false); // Estado para modo edición
  const URL = 'https://tienditadelabuelo.postgres.database.azure.com';
  const url2 = 'http://localhost:3080';

  useEffect(() => {
    // Obtener los datos del usuario utilizando el ID
    const fetchUser = async () => {
      try {
        console.log('Fetching user data for userId:', userId); // Log de depuración
        const response = await fetch(url2+'/usuarios/'+userId);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('User data:', data); // Log de depuración
        setUser(data);
        setLoading(false); // Finalizar estado de carga
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        setError(error.message); // Almacenar el mensaje de error
        setLoading(false); // Finalizar estado de carga incluso si hay un error
      }
    };

    fetchUser();
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(url2+'/usuarios/'+userId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      if (!response.ok) {
        throw new Error('Error al actualizar los datos del usuario');
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
      setError('Error al actualizar los datos del usuario');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  if (loading) {
    return <Typography>Cargando...</Typography>; // Mostrar mensaje de carga mientras se obtienen los datos
  }

  if (error) {
    return <Typography>Error al cargar los datos del usuario: {error}</Typography>; // Mostrar mensaje de error detallado
  }

  if (!user) {
    return <Typography>Error al cargar los datos del usuario.</Typography>; // Manejar error de carga de datos
  }

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Detalles del Usuario
          </Typography>
          <TextField
            label="Nombre"
            name="nombre"
            value={user.nombre}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Apellido"
            name="apellido"
            value={user.apellido}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Correo"
            name="correo"
            value={user.correo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          {isEditing ? (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleSaveClick}
            >
              Guardar
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleEditClick}
            >
              Editar
            </Button>
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default DetalleUsuario;
