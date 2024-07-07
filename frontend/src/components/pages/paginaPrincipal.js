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
    const [objetos,setObjetos] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:3080/admin/productos",{
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            setObjetos(data);
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
                    {/*
                        {objetos.filter(objetos => objetos.tipo === "coleccion").map(objetos => (
                        <SCollection
                            id={objetos.id}
                            txtL1={objetos.nombre}
                            hiperv="Learn More"
                            src={objetos.imagen}
                            width='25vw'
                            height='50vh'
                        />
                    ))}
                    */}
                    
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
                    {objetos.filter(objetos => objetos.id>0 && objetos.id<4).map(objetos => (
                        <SCollection
                        txtL1={objetos.nombre}
                        hiperv="Learn More"
                        src={objetos.imagen}
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
                 {objetos.filter(objetos => objetos.id>8 && objetos.id<14).map(objetos => (
                    <SCollection
                        txtL1={objetos.nombre}
                        hiperv="Learn More"
                        src={objetos.imagen}
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
                    {objetos.filter(objetos => objetos.id === 14).map(objetos => (
                        <SCollection
                            txtL1={objetos.nombre}
                            hiperv="Learn More"
                            src={objetos.imagen}
                            width='50vw'
                            height='60vh'
                        />
                    ))}
                    
                <Stack
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {objetos.filter(objetos => objetos.id>14 && objetos.id<17).map(objetos => (
                        <SCollection
                            txtL1={objetos.nombre}
                            hiperv="Learn More"
                            src={objetos.imagen}
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
                 {objetos.filter(objetos => objetos.id>16).map(objetos => (
                    <SCollection
                        txtL1={objetos.nombre}
                        hiperv="Learn More"
                        src={objetos.imagen}
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
