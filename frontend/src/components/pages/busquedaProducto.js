import { Box } from "@mui/material";
import React, { useState, useEffect } from 'react';
import Typography from "@mui/material/Typography";
import ListaItemCarr from "../user/ItemBusqueda";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Header2 from '../user/headerU';
import Footer from '../common/footer';
import { useLocation } from "react-router-dom";
function Busqueda(){
    const location = useLocation();
    const searchQuery = location.state.searchQuery;

    const [selectedValue, setSelectedValue] = useState(1);
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const [producto, setProducto] = useState([]);
    const [serie, setSerie] = useState({});
    const [tipo, setTipo] = useState({});
    const [marca,setMarca] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch("http://localhost:3080/admin/productos", {
              method: "GET",
              headers: {
                "Content-Type": "application/json"
              }
            });
            const data = await response.json();
            setProducto(data);
      
            const seriesPromises = data.map(async (producto) => {
              try {
                const serieResponse = await fetch(`http://localhost:3080/admin/series/${producto.id}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json"
                  }
                });
                const serieData = await serieResponse.json();
                if (serieData && serieData.nombre) {
                  return { [producto.id]: serieData.nombre };
                } else {
                  return { [producto.id]: null }; // or some default value
                }
              } catch (error) {
                console.error(`Error fetching serie for product ${producto.id}:`, error);
                return { [producto.id]: null }; // or some default value
              }
            });
      
            const tiposPromises = data.map(async (producto) => {
              try {
                const tipoResponse = await fetch(`http://localhost:3080/admin/tipos/${producto.id}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json"
                  }
                });
                const tipoData = await tipoResponse.json();
                if (tipoData && tipoData.nombre) {
                  return { [producto.id]: tipoData.nombre };
                } else {
                  return { [producto.id]: null }; // or some default value
                }
              } catch (error) {
                console.error(`Error fetching tipo for product ${producto.id}:`, error);
                return { [producto.id]: null }; // or some default value
              }
            });
      
            const marcasPromises = data.map(async (producto) => {
              try {
                const marcaResponse = await fetch(`http://localhost:3080/admin/marcas/${producto.id}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json"
                  }
                });
                const marcaData = await marcaResponse.json();
                if (marcaData && marcaData.nombre) {
                  return { [producto.id]: marcaData.nombre };
                } else {
                  return { [producto.id]: null }; // or some default value
                }
              } catch (error) {
                console.error(`Error fetching marca for product ${producto.id}:`, error);
                return { [producto.id]: null }; // or some default value
              }
            });
      
            const seriesData = await Promise.all(seriesPromises);
            const seriesObject = Object.assign({},...seriesData);
            setSerie(seriesObject);
      
            const tiposData = await Promise.all(tiposPromises);
            const tiposObject = Object.assign({},...tiposData);
            setTipo(tiposObject);
      
            const marcasData = await Promise.all(marcasPromises);
            const marcasObject = Object.assign({},...marcasData);
            setMarca(marcasObject);
      
          } catch (error) {
            console.error("Error fetching productos:", error);
          }
        };
        fetchData();
      }, []);

            
      
    return(
        <>
            <Header2/>
            <Box
                sx={{
                    display : 'flex',
                    justifyContent : 'flex-end',
                    mx : 5,
                    alignItems : 'center'
                }}
            >
                <Typography variant="h6" fontWeight="bold" sx={{mr : 2}}>Ordenar Por:</Typography>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedValue}
                    onChange={handleChange}
                    sx={{
                        width : '10vw'
                    }}
                >
                    <MenuItem value={1}>Precio</MenuItem>
                    <MenuItem value={2}>Nombre</MenuItem>
                </Select>
                
            </Box>
            <Box
                sx={{
                    width: '95.5%',
                    minHeight: '4vh',
                    display : 'flex',
                    alignItems : 'center',
                    border: '2px solid gray',
                    backgroundColor : 'lightgray',
                    mx : 5,
                    mt : 2
                }}
            >
                <Typography variant="h5">
                    Resultados de busqueda
                </Typography>
            </Box>

            <Box
                sx={{
                    mx : 5,
                    mt : 2
                }}
            >
                {producto.filter(producto => producto.nombre === searchQuery || serie[producto.id] === searchQuery || marca[producto.id] === searchQuery || tipo[producto.id] === searchQuery || searchQuery === "" ).map(producto => (
                    <ListaItemCarr
                        key={`lista1-${producto.id}`}
                        imagen = {producto.imagen}
                        nombre = {producto.nombre}
                        serie = {serie[producto.id]}
                        fabricante= {marca[producto.id]}
                        precio = {producto.precio}
                    />
                ))};
            </Box>
            <Box
                sx={{
                    display : "flex",
                    justifyContent : "flex-end",
                    mx : 5,
                    mt : 50
                }}
            >
                <Stack spacing={2}>
                    <Pagination count={10} shape="rounded"/>
                </Stack>
            </Box>
            <Footer/>
        </>
    );
}
export default Busqueda;