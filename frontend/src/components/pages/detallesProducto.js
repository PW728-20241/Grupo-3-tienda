import DetailsBox from "../user/detailsBox";
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Header2 from '../user/headerU';
import Footer from '../common/footer';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { useLocation} from 'react-router-dom';

function Details(){
    const location = useLocation();
    const id = location.state.id;
    const [producto,setProducto] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:3080/admin/productos/"+ id,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            setProducto(data);
            console.log(id);
            
        };
        fetchData();
      }, [id]);
    return(
        <>
            <Header2/>
            <Typography sx={{fontSize : '2rem', px : 8}}>Titulo del Producto: {producto.nombre}</Typography>

            <br/>
            <Typography sx={{fontSize : '1.5rem', px : 8}}>Por: {producto.marca} -Serie: {producto.serie}</Typography>

            <AppBar position="static"
                sx = {{
                    backgroundColor: 'black',
                    padding: '2px',
                    marginTop : '30px',
                    marginBottom: '50px'
                }}
            >
            </AppBar>

            <DetailsBox backgroundImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZMO63qalbID4AxdCopW60yPctR4fSHedULxfiyDr94g&s"/>

            <Typography variant="body1" component="p" fontWeight="bold" px={8} pt={2}>Descripcion:</Typography>
            <Typography variant="body1" component="p" px={8} pt={2}>
                Descripcion del producto
            </Typography>
            <Box
                sx={{
                    backgroundColor : 'lightgray',
                    px : 8
                }}
            >
                <Typography variant="body1" component="p" fontWeight="bold"pt={2}>Caracteristicas del producto:</Typography>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon style={{ color: 'black' }} />
                        </ListItemIcon>
                        <ListItemText primary="Mide 18centimetros" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon style={{ color: 'black' }} />
                        </ListItemIcon>
                        <ListItemText primary="Hecho de PVC" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon style={{ color: 'black' }} />
                        </ListItemIcon>
                        <ListItemText primary="De la serie Voltron" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon style={{ color: 'black' }} />
                        </ListItemIcon>
                        <ListItemText primary="Articulado" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon style={{ color: 'black' }} />
                        </ListItemIcon>
                        <ListItemText primary="15piezas distintas"/>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon style={{ color: 'black' }} />
                        </ListItemIcon>
                        <ListItemText primary="Combinable con otras figuras" />
                    </ListItem>
                </List>
            </Box>
   
            <Footer/>
        </>
        
    );
}
export default Details;