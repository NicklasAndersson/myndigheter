import { useState, useEffect } from 'react'

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';


function App() {
  const [myndighet, setMyndighet] = useState([])
  useEffect(() => {
    myndigheter()
  }, [])

  const myndigheter = async () => {
    const resp = await fetch('https://alla-myndigheter.wwn.workers.dev/')

    setMyndighet(await resp.json())
  }

  const paginationModel = { page: 0, pageSize: 50 };
  const columns = [
    { field: 'Namn', headerName: 'Namn', width: 300 },
    { field: 'Organisationsnr', headerName: 'Org nr', width: 110 },
    { field: 'Webbadress', headerName: 'Webbadress', width: 350 },
    {
      field: 'Epost',
      headerName: 'Epost',
      width: 250,
    },
  ];
  
  return (
    <Container>
      <Paper>
      <DataGrid
        rows={myndighet}
        columns={columns}
        getRowId={(row) => row.Organisationsnr + row.Namn}
        initialState={{ pagination: { paginationModel } }}
        sx={{ border: 0 }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
      </Paper>
  </Container>
  )
}

export default App
