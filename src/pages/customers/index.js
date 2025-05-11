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
    const token = localStorage.getItem('accessToken')
    console.log('✅ FE token:', token)

    if (!token) {
      alert('Vui lòng đăng nhập')
      router.push('/auth/login')
      return
    }

    try {
      const res = await axios.get(`${API_URL}/v1/services`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('✅ Gửi header:', `Bearer ${token}`)
      setServices(res.data)
    } catch (err) {
      console.error('❌ Lỗi lấy danh sách dịch vụ:', err)
      if (err.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
        router.push('/auth/login')
      }
    }
  }

  const handleEdit = serviceId => {
    router.push(`/services/update/${serviceId}`)
  }

  const handleDelete = async serviceId => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      alert('Vui lòng đăng nhập')
      return
    }

    if (!window.confirm('Bạn có chắc chắn muốn xoá dịch vụ này?')) return

    try {
      await axios.delete(`${API_URL}/v1/services/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      fetchServices()
    } catch (err) {
      console.error('❌ Lỗi khi xoá dịch vụ:', err)
      alert('Xoá thất bại. Vui lòng thử lại.')
    }
  }

  const filteredServices = services.filter(service => {
    const keyword = search.toLowerCase()
    const matchTitle = (service.title || '').toLowerCase().includes(keyword)
    const matchGroup = (service.services || []).some(group => {
      const groupName = (group.name || '').toLowerCase().includes(keyword)
      const matchType = (group.types || []).some(
        t => (t.type || '').toLowerCase().includes(keyword) || (t.price || '').toLowerCase().includes(keyword)
      )
      return groupName || matchType
    })
    return matchTitle || matchGroup
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
            <Link href='/services/create' passHref legacyBehavior>
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
                    filteredServices.map((section, i) => {
                      const totalRows = section.services.reduce((acc, srv) => acc + (srv.types?.length || 1), 0)
                      return (
                        <Fragment key={section._id || i}>
                          {section.title && (
                            <TableRow sx={{ bgcolor: '#1976d2' }}>
                              <TableCell colSpan={5} sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                                {section.title.toUpperCase()}
                              </TableCell>
                            </TableRow>
                          )}
                          {section.services.map((srv, j) => {
                            const types = srv.types?.length > 0 ? srv.types : [srv]
                            return types.map((t, k) => (
                              <TableRow key={`${i}-${j}-${k}`}>
                                {k === 0 && <TableCell rowSpan={types.length}>{srv.name || '-'}</TableCell>}
                                <TableCell>{t.type || '-'}</TableCell>
                                <TableCell>{t.price || '-'}</TableCell>
                                <TableCell>{t.warranty || '-'}</TableCell>
                                {j === 0 && k === 0 && (
                                  <TableCell rowSpan={totalRows} align='center'>
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
                      )
                    })
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
