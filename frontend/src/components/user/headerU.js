import { Box, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

function Header2() {
  const navigate = useNavigate();

  const handlerClickMV = () => {
    navigate("/busqueda", {state: {searchQuery: "mas vendidos"}});
  };

  const handlerClickO = () => {
    navigate("/busqueda", {state: {searchQuery: "oferta"}});
  };

  const handlerClickN = () => {
    navigate("/busqueda", {state: {searchQuery: "nuevo"}});
  };

  return (
    <>
      <AppBar position="static"
        sx = {{
          color: '#fff',
          padding: '20px',
          marginBottom: '20px'
        }}
      >
        <Toolbar>
          <Button href="/" variant="h1" sx={{fontWeight : 'bold', fontSize : '30px'}}>
            TIENDA
          </Button>
          <Button color="inherit" onClick={handlerClickMV} sx={{mx : '20px'}}>Mas vendidos</Button>
          <Button color="inherit" onClick={handlerClickN} sx={{mx : '20px'}}>Nuevos</Button>
          <Button color="inherit" onClick={handlerClickO} sx={{mx : '20px'}}>Ofertas</Button>
          <Box sx={{flexGrow : 1}}/>
          <IconButton color="withe" href="/carritoDeCompras">
            <LocalGroceryStoreIcon/>
          </IconButton>
          <Button color ="inherit" href="#" sx={{mx : '20px'}}>Ayuda</Button>
          <Button color ="inherit" href="/pantalla-principal" sx={{mx : '20px'}}>Mi Cuenta</Button>
          
        </Toolbar>
      </AppBar>
    </>
  )
}
export default Header2;

