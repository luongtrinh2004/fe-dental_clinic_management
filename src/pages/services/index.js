import { useEffect, useState, Fragment } from 'react'
import axios from 'axios'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material'

const ServicePage = () => {
  const [services, setServices] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/v1/services')
      setServices(res.data)
    } catch (err) {
      console.error('Lỗi lấy danh sách dịch vụ:', err)
    }
  }

  const filteredServices = services.filter(service =>
    (service.title || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Tra cứu bảng giá dịch vụ' />
          <CardContent sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label='Tìm theo tên danh mục'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Bảng giá dịch vụ' />
          <CardContent>
            <TableContainer component={Paper}>
              <Table size='small'>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f0f0f0' }}>
                    <TableCell>Tên dịch vụ</TableCell>
                    <TableCell sx={{ textAlign: 'left' }}>Loại</TableCell>
                    <TableCell>Thành tiền</TableCell>
                    <TableCell>Bảo hành</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredServices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography align='center'>Không tìm thấy dịch vụ</Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {filteredServices.map((section, i) => (
                    <Fragment key={i}>
                      {section.title && (
                        <TableRow sx={{ bgcolor: '#1976d2' }}>
                          <TableCell
                            colSpan={4}
                            sx={{
                              color: 'white',
                              fontWeight: 'bold',
                              textAlign: 'center'
                            }}
                          >
                            {section.title}
                          </TableCell>
                        </TableRow>
                      )}

                      {section.services.map((srv, j) => (
                        <Fragment key={j}>
                          {srv.types && srv.types.length > 1 ? (
                            <>
                              <TableRow>
                                <TableCell rowSpan={srv.types.length} sx={{ verticalAlign: 'top' }}>
                                  {srv.name}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'left' }}>{srv.types[0].type}</TableCell>
                                <TableCell>{srv.types[0].price}</TableCell>
                                <TableCell>{srv.types[0].warranty || '-'}</TableCell>
                              </TableRow>
                              {srv.types.slice(1).map((t, k) => (
                                <TableRow key={k}>
                                  <TableCell sx={{ textAlign: 'left' }}>{t.type}</TableCell>
                                  <TableCell>{t.price}</TableCell>
                                  <TableCell>{t.warranty || '-'}</TableCell>
                                </TableRow>
                              ))}
                            </>
                          ) : (
                            <TableRow>
                              <TableCell>{srv.name}</TableCell>
                              <TableCell sx={{ textAlign: 'left' }}>{srv.types?.[0]?.type || '-'}</TableCell>
                              <TableCell>{srv.types?.[0]?.price || srv.price || '-'}</TableCell>
                              <TableCell>{srv.types?.[0]?.warranty || srv.warranty || '-'}</TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      ))}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ServicePage
