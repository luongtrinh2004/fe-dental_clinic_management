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
  Typography,
  Button,
  Box
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const ServicePage = () => {
  const [services, setServices] = useState([])
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/v1/services`)
      setServices(res.data)
    } catch (err) {
      console.error('Lỗi lấy danh sách dịch vụ:', err)
    }
  }

  const handleEdit = serviceId => {
    router.push(`/services/update/${serviceId}`)
  }

  const handleDelete = async serviceId => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) return
    try {
      await axios.delete(`${API_URL}/v1/services/${serviceId}`)
      fetchServices()
    } catch (err) {
      console.error('Lỗi khi xóa dịch vụ:', err)
      alert('Xóa thất bại. Vui lòng thử lại.')
    }
  }

  const filteredServices = services.filter(service => {
    const keyword = search.toLowerCase()
    const inTitle = (service.title || '').toLowerCase().includes(keyword)
    const inServices = (service.services || []).some(srv => {
      const nameMatch = (srv.name || '').toLowerCase().includes(keyword)
      const typeMatch = (srv.types || []).some(
        t =>
          (t.type || '').toLowerCase().includes(keyword) || (t.price || '').toString().toLowerCase().includes(keyword)
      )
      return nameMatch || typeMatch
    })
    return inTitle || inServices
  })

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
            <Link href='/services/create' passHref>
              <Button variant='contained' component='a'>
                + Thêm dịch vụ
              </Button>
            </Link>
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
                    <TableCell width='25%'>Tên dịch vụ</TableCell>
                    <TableCell width='20%'>Loại</TableCell>
                    <TableCell width='20%'>Thành tiền</TableCell>
                    <TableCell width='15%'>Bảo hành</TableCell>
                    <TableCell width='20%' align='center'>
                      Hành động
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredServices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography align='center'>Không tìm thấy dịch vụ</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredServices.map((section, i) => (
                      <Fragment key={i}>
                        {section.title && (
                          <TableRow sx={{ bgcolor: '#1976d2' }}>
                            <TableCell
                              colSpan={5}
                              sx={{
                                color: '#fff !important',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                borderBottom: 'none'
                              }}
                            >
                              {section.title.toUpperCase()}
                            </TableCell>
                          </TableRow>
                        )}

                        {section.services.map((srv, j) => {
                          const typeRows = srv.types && srv.types.length > 0 ? srv.types : [srv]
                          return typeRows.map((t, k) => (
                            <TableRow key={k}>
                              {/* Chỉ hiển thị name nếu dòng đầu hoặc chỉ có 1 type */}
                              {(k === 0 || typeRows.length === 1) && (
                                <TableCell rowSpan={typeRows.length}>{srv.name || '-'}</TableCell>
                              )}
                              <TableCell>{t.type || '-'}</TableCell>
                              <TableCell>{t.price || '-'}</TableCell>
                              <TableCell>{t.warranty || '-'}</TableCell>
                              {j === 0 && k === 0 && (
                                <TableCell
                                  rowSpan={section.services.reduce((acc, s) => acc + (s.types?.length || 1), 0)}
                                  align='center'
                                >
                                  <Box display='flex' gap={1} justifyContent='center'>
                                    <Button size='small' variant='outlined' onClick={() => handleEdit(section._id)}>
                                      Chỉnh sửa
                                    </Button>
                                    <Button
                                      size='small'
                                      variant='outlined'
                                      color='error'
                                      onClick={() => handleDelete(section._id)}
                                    >
                                      Xoá
                                    </Button>
                                  </Box>
                                </TableCell>
                              )}
                            </TableRow>
                          ))
                        })}
                      </Fragment>
                    ))
                  )}
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
