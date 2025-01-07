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
    const respJson = await resp.json();
    const respWhois = await Promise.all( respJson.map(async mynd => {
      try {
        const url = mynd.Webbadress
        const parsedUrl = URL.parse(url.startsWith("http") ? url : `https://${url}`)
        const hostname = parsedUrl.hostname.replace('www.', '').split('.').slice(-2).join('.')

        const whois = await fetch(`https://whois.wwn.se/?domain=${hostname}`,
          {
            headers: {
              "Accept": "application/json"
            }
          }
        )
        const whoisJson = await whois.json()
        return {
          ...mynd,
          'whois': whoisJson
        }
      } catch {
        
      }
      return {
        ...mynd
      }
    }))
      setMyndighet(respWhois)
      console.log(respWhois)
  }



  const paginationModel = { page: 0, pageSize: 50 };
  const columns = [
    { field: 'Namn', headerName: 'Namn', width: 350 },
    { field: 'Organisationsnr', headerName: 'Org nr', width: 110 },
    { field: 'Webbadress', headerName: 'Webbadress', width: 350 },
    { field: 'Epost', headerName: 'Epost', width: 200 },
    { field: 'whois', headerName: 'Förfallodatum', with: 150, 
      valueGetter: (value) => {
        if(value && value.expires){
          return value.expires
        }
        return 'okänt'
    }},
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
