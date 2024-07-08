import Stack from '@mui/material/Stack';
import SCollection from '../user/SCollection';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Header2 from '../user/headerU';
import Footer from '../common/footer';
import SearchBar from '../user/searchBar';
import AppBar from '@mui/material/AppBar';
import React, { useState, useEffect } from 'react';

function Principal(){
    const [producto, setProducto] = useState([]);
    const [serie, setSerie] = useState({});
    const [tipo, setTipo] = useState({});
    
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
    
          const seriesData = await Promise.all(seriesPromises);
          const seriesObject = Object.assign({},...seriesData);
          setSerie(seriesObject);
    
          const tiposData = await Promise.all(tiposPromises);
          const tiposObject = Object.assign({},...tiposData);
          setTipo(tiposObject);
    
        } catch (error) {
          console.error("Error fetching productos:", error);
        }
      };
      fetchData();
    }, []);

    return(
       <>   
            <Header2/>
            <SearchBar/>
            <Box
            //Coleccion de Items
            sx={{
                pt : 6,
                mx : 8,
            }}
            >
                <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                >
                    {producto.filter(producto => serie[producto.id] && producto !== tipo[producto.id]).slice(0,3).map(producto => (
                        <SCollection
                            key={`lista1-${producto.id}`}
                            id={producto.id}
                            txtL1={serie[producto.id]}
                            hiperv="Learn More"
                            src={producto.imagen}
                            width='25vw'
                            height='50vh'
                        />
                    ))};
                </Stack>
            </Box>

            <Box 
                //Items fila 1
                sx={{
                    pt: 6,
                    mx : 8,
                    justifyContent : 'center'
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {producto.filter(producto => !serie[producto.id] && tipo[producto.id] != "nuevo").slice(0,5).map(producto => (
                        <SCollection
                        txtL1={producto.nombre}
                        hiperv="Learn More"
                        src={producto.imagen}
                        width='12vw'
                        height='30vh'
                        />
                    ))}
                </Stack> 
            </Box>

            <Box
                //Items fila 2
                sx={{
                    px : 8,
                    pt : 8
                }}
            >
                <Stack
                 direction="row"
                 justifyContent="space-between"
                 alignItems="center"
             >
                 {producto.filter(producto => !serie[producto.id] && tipo[producto.id] != "nuevo").slice(5,10).map(producto => (
                    <SCollection
                        txtL1={producto.nombre}
                        hiperv="Learn More"
                        src={producto.imagen}
                        width='12vw'
                        height='30vh'
                    />
                 ))}
                 
             </Stack>
            </Box>

            <AppBar position="static"
                sx = {{
                    backgroundColor: 'black',
                    padding: '10px',
                    marginTop : '100px',
                    marginBottom: '50px'
                }}
            >
            </AppBar>

            <Typography id="Nuevos" sx={{fontSize : '4rem', ml : 8} }>NUEVOS</Typography>

            <Box 
                sx={{
                    mx : 8,
                    pt : 8,
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                >
                    {producto.filter(producto => tipo[producto.id] === "nuevo" && serie[producto.id]).slice(14,14).map(producto => (
                        <SCollection
                            txtL1={serie[producto.id]}
                            hiperv="Learn More"
                            src={producto.imagen}
                            width='50vw'
                            height='60vh'
                        />
                    ))}
                    
                <Stack
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {producto.filter(producto => tipo[producto.id] === "nuevo" && serie[producto.id]).slice(15,17).map(producto => (
                        <SCollection
                            txtL1={producto.nombre}
                            hiperv="Learn More"
                            src={producto.imagen}
                            width='40vw'
                            height='30vh'
                        />
                    ))}
                    
                </Stack>
                </Stack>
            </Box>
                
            <Box
                sx={{
                    px : 8,
                    pt : 8
                }}
            >
                <Stack
                 direction="row"
                 justifyContent="space-between"
                 alignItems="center"
                >
                 {producto.filter(producto => tipo[producto.id] === "nuevo" && !serie[producto.id]).slice(18,22).map(producto => (
                    <SCollection
                        txtL1={producto.nombre}
                        hiperv="Learn More"
                        src={producto.imagen}
                        width='12vw'
                        height='30vh'
                    />
                 ))}
                 
                </Stack>
            </Box>
            <Footer/>
       </>
    );
}

export default Principal;
