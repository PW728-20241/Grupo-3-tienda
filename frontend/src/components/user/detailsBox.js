import { Box, Button, Stack, Link } from "@mui/material";
import Typography from "@mui/material/Typography";
import React, { useState, useEffect } from 'react';
import { useLocation} from 'react-router-dom';

function DetailsBox(img){
    const [count, setCount] = useState(0);

    const handleDecrement = () => {
        setCount(prevCount => Math.max(prevCount - 1,0));
    };

    const handleIncrement = () => {
        setCount(prevCount => prevCount + 1);
    };

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
            <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"

        >
            <Box
                sx={{
                    width: '60%',
                    minHeight: '70vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    pt: 2,
                    border: '2px solid gray',
                    ml: 8,
                    borderRadius: 2,
                    backgroundImage: `url(${producto.imagen})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
            </Box>
            <Box sx={{ 
                width: '25%', 
                height: '70vh', 
                display: 'flex', 
                flexDirection: 'column', 
                mx : 8
                }}>
            <Box sx={{ 
                width: '100%', 
                height: '10%', 
                border: '2px solid gray',
                display : 'flex',
                alignItems : 'center',
                justifyContent : 'center'
                }}
            >
                <Typography variant="h4">DISPONIBLE</Typography>
                
            </Box>
            <Box sx={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: 'lightgray',
                border: '2px solid gray',
                display : 'flex',
                justifyContent : 'center',
                textAlign : 'center',
                pt : 2
                }}
            >
                <Stack
                    direction="column" spacing={8}
                    alignItems={'center'}
                >
                    <Typography variant="h3" fontWeight="bold" sx={{pt : '50px'}}>S/{producto.precio}</Typography>
                    <Button variant="contained" sx={{width : '200px', height : '150px', fontSize : '20px', bl:'50px'

                      
                    }}>AÑADIR AL CARRITO</Button>
                    <Typography variant="h4" fontWeight="bold">Cantidad:</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button variant="text" onClick={handleDecrement} sx={{ width: '40px',height : '40px', marginRight: '10px', fontSize : '120px'}}>
                            -
                        </Button>
                        <Box
                            sx={{
                                border: '2px solid gray',
                                borderRadius: 2,
                                backgroundColor : 'white',
                                display : 'flex',
                                justifyContent : 'center',
                                alignItems : 'center',
                                width : '3vw',
                                height : '3vh'
                                
                            }}
                        
                        >
                            <Typography variant="h6" sx={{ minWidth: '30px', textAlign: 'center' }}>
                            {count}
                            </Typography>
                        </Box>
                        
                        <Button variant="text" onClick={handleIncrement} sx={{width: '40px',height : '40px', marginRight: '10px', fontSize : '60px'}}>
                            +
                        </Button>
                    </Box>
                    <Link href="#" variant="h4" sx={{color : 'black', textDecorationColor : 'black', pt : '80px'}}>Ver metodos disponibles</Link>
                </Stack>
            </Box>
        </Box>
        </Stack>
        </>
    );
    
}
export default DetailsBox;