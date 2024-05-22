import * as React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import { Container, Stack, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TitleBar from '../common/titleBar';
import DataTable2 from '../common/dataTable2';

export function Series() {
  const columnas = ["id",200,"Nombre",3000,"Descripcion",300,"Fecha de Creacion",150,"Nro. Productos",150,"Acciones",90,"Opciones",90,"xddd",90];
  const datos = [1, "Manga Dragon Ball VIZ", "Coleccion del manga de dragon ball VIZ publicado por Akira Toriyama","11/02/2022", 12, "Ver","Editar/Eliminar","XDDDD"
  ,2, "Manga Dragon Ball VIZ", "Coleccion del manga de dragon ball VIZ publicado por Akira Toriyama","11/02/2022", 12, "Ver","Editar/Eliminar","XDDDD"
  ,3, "Manga Dragon Ball VIZ", "Coleccion del manga de dragon ball VIZ publicado por Akira Toriyama","11/02/2022", 12, "Ver","Editar/Eliminar","XDDDD"
  ,4, "Manga Dragon Ball VIZ", "Coleccion del manga de dragon ball VIZ publicado por Akira Toriyama","11/02/2022", 12, "Ver","Editar/Eliminar","XDDDD"
  ,5, "Manga Dragon Ball VIZ", "Coleccion del manga de dragon ball VIZ publicado por Akira Toriyama","11/02/2022", 12, "Ver","Editar/Eliminar","XDDDD"
  ]

  return (
    <>
      <Stack
        direction="column"
        justifyContent="flex-start"
        paddingLeft="1vw"
      >
        <TitleBar title={'Listado de Series'} />
        <TextField id='Serie' placeholder='Ingresar nombre, descripcion o ID' variant='outlined' 
          sx={{
            paddingTop: "15px",
            paddingBottom: "30px",
            height: '45px',
            width: '77vw',
          }}
        >
        </TextField>
        <DataTable2 columnas={columnas} datos={datos}/>
      </Stack>
    </>
  );
}

