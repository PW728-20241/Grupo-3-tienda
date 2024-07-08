import React, { useState, useEffect } from 'react';
import { Stack, TextField, Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, TablePagination, Button, Typography } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
}

export default function Series() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [seriesData, setSeriesData] = useState([]);
  const navigate = useNavigate();
  const URL = 'https://tienditadelabuelo.postgres.database.azure.com';
  const url2 = 'http://localhost:3080';

  useEffect(() => {
    fetchSeries();
  }, []);

  useEffect(() => {
    setFilteredData(
      seriesData.filter((serie) =>
        serie.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        serie.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        serie.id.toString().includes(searchTerm)
      )
    );
  }, [searchTerm, seriesData]);

  const fetchSeries = async () => {
    try {
      const response = await fetch(url2+'/admin/series');
      const data = await response.json();
      setSeriesData(data);
    } catch (error) {
      console.error('Error al obtener las series:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewClick = (serie) => {
    navigate('/admin/agregarserie/'+serie.id, { state: { serie } });
  };

  const handleAddNewSerie = () => {
    navigate('/admin/agregarserie');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '76vh', mb: 4, marginBottom: "40px" }}>
      <Stack direction="column" justifyContent="flex-start" paddingLeft="1vw" sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" sx={{ paddingTop: "15px", paddingBottom: "15px" }}>
          Series
        </Typography>
        <TextField 
          id='Serie' 
          placeholder='Buscar por nombre, descripción o ID' 
          variant='outlined'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            paddingBottom: "30px",
            height: '45px',
            width: '77vw',
          }}
        />
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddNewSerie}>
          Añadir Nueva Serie
        </Button>
        <TableContainer component={Paper} sx={{ flexGrow: 1 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                <TableCell>Nro. Productos</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((serie) => (
                <TableRow key={serie.id}>
                  <TableCell>{serie.id}</TableCell>
                  <TableCell>{serie.nombre}</TableCell>
                  <TableCell>{serie.descripcion}</TableCell>
                  <TableCell>{serie.fechaRegistro}</TableCell>
                  <TableCell>{serie.NroProductos}</TableCell>
                  <TableCell>
                    <Button color="primary" onClick={() => handleViewClick(serie)}>Ver</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={6}
                  count={filteredData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}
