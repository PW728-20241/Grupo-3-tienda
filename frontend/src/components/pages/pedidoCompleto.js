import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link'; 
import Footer from '../common/footer';
import Header from '../common/header';
import { Stack } from '@mui/material';
import SCollection from '../user/SCollection';

export default function TermPed() {
    const [objetos, setObjetos] = useState([]);

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
                setObjetos(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Header />
            <Typography variant="h5" component="p" sx={{ textAlign: 'center' }}>
                ¡Muchas gracias por su pedido!
            </Typography>
            <br />
            <br />
            <br />
            <Typography variant="body1" component="p" sx={{ textAlign: 'center' }}>
                Puedes ver el detalle y estado de tu pedido ingresando a <Link href="/pantalla-principal">tu cuenta</Link>
            </Typography>

            <Typography variant="h5" component="p" pt={20}>
                También te podría interesar...
            </Typography>
            <Box
                sx={{
                    px: 8,
                    pt: 8
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2} // Agregué spacing para mejorar la separación visual entre elementos
                >
                    {objetos.filter(objeto => objeto.id > 0).map(objeto => (
                        <SCollection
                            key={objeto.id} // Añadí la key con objeto.id como valor único
                            txtL1={objeto.nombre}
                            hiperv="Learn More"
                            src={objeto.imagen}
                            width='12vw'
                            height='30vh'
                        />
                    ))}
                </Stack>
            </Box>

            <Footer />
        </>
    );
}