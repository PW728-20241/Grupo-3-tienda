import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MenuLateral = ({ userId, setSelectedSection }) => {
  const navigate = useNavigate();

  const handleNavigation = (section) => {
    setSelectedSection(section);
    if (section === 'datos-registro') {
      navigate('/detalleusuario/'+userId);
    } else if (section === 'cambiar-password') {
      navigate('/cambiarcontrasena/'+userId);
    }
  };

  return (
    <Box sx={{ width: '250px', mr: 4 }}>
      <Typography variant="h6" gutterBottom>
        Mi cuenta
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Link component="button" variant="body1" sx={{ mb: 1 }} onClick={() => handleNavigation('ordenes-recientes')}>
          Órdenes recientes
        </Link>
        <Link component="button" variant="body1" sx={{ mb: 1 }} onClick={() => handleNavigation('datos-registro')}>
          Datos de registro
        </Link>
        <Link component="button" variant="body1" onClick={() => handleNavigation('cambiar-password')}>
          Cambiar contraseña
        </Link>
      </Box>
    </Box>
  );
};

export default MenuLateral;
