import { useEffect, useState } from 'react'
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
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const ServicePage = () => {
  const [services, setServices] = useState([])
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    services: [{ name: '', price: '', warranty: '' }]
  })
  const [editId, setEditId] = useState(null)

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

  const filteredServices = services.filter(service => service.category.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = async id => {
    if (window.confirm('Xóa danh mục dịch vụ này?')) {
      try {
        await axios.delete(`http://localhost:5000/v1/services/${id}`)
        fetchServices()
      } catch (err) {
        console.error('Lỗi xóa:', err)
      }
    }
  }

  const handleEdit = service => {
    setFormData({
      category: service.category,
      services: service.services
    })
    setEditId(service._id)
    setOpenDialog(true)
  }

  const handleAdd = () => {
    setFormData({
      category: '',
      services: [{ name: '', price: '', warranty: '' }]
    })
    setEditId(null)
    setOpenDialog(true)
  }

  const handleChangeService = (index, field, value) => {
    const updated = [...formData.services]
    updated[index][field] = value
    setFormData({ ...formData, services: updated })
  }

  const handleAddServiceRow = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { name: '', price: '', warranty: '' }]
    })
  }

  const handleRemoveServiceRow = index => {
    const updated = [...formData.services]
    updated.splice(index, 1)
    setFormData({ ...formData, services: updated })
  }

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/v1/services/${editId}`, formData)
      } else {
        await axios.post('http://localhost:5000/v1/services', formData)
      }
      setOpenDialog(false)
      fetchServices()
    } catch (err) {
      console.error('Lỗi gửi form:', err)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Tìm kiếm dịch vụ' />
          <CardContent sx={{ display: 'flex', gap: 2 }}>
            <TextField fullWidth label='Nhập tên danh mục' value={search} onChange={e => setSearch(e.target.value)} />
            <Button variant='contained' onClick={handleAdd}>
              + Thêm danh mục
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Danh sách dịch vụ' />
          <CardContent>
            <TableContainer component={Paper}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Danh mục</TableCell>
                    <TableCell>Dịch vụ</TableCell>
                    <TableCell>Giá</TableCell>
                    <TableCell>Bảo hành</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredServices.map((service, i) => {
                    const isSingle = service.services.length === 1
                    return service.services.map((item, j) => (
                      <TableRow key={`${i}-${j}`}>
                        {j === 0 && (
                          <TableCell
                            rowSpan={service.services.length}
                            sx={{ verticalAlign: 'top', fontWeight: 'bold' }}
                          >
                            {service.category || (
                              <Typography sx={{ fontStyle: 'italic', color: 'gray' }}>Không có danh mục</Typography>
                            )}
                          </TableCell>
                        )}
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{item.warranty || '-'}</TableCell>
                        <TableCell>
                          {j === 0 && (
                            <>
                              <IconButton color='primary' onClick={() => handleEdit(service)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton color='error' onClick={() => handleDelete(service._id)}>
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {filteredServices.length === 0 && (
              <Typography variant='body2' align='center' sx={{ mt: 2 }}>
                Không tìm thấy dịch vụ
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth='sm' fullWidth>
        <DialogTitle>{editId ? 'Sửa danh mục dịch vụ' : 'Thêm danh mục mới'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label='Tên danh mục'
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            fullWidth
          />
          {formData.services.map((s, i) => (
            <Grid container spacing={2} key={i}>
              <Grid item xs={4}>
                <TextField
                  label='Tên dịch vụ'
                  value={s.name}
                  onChange={e => handleChangeService(i, 'name', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label='Giá'
                  value={s.price}
                  onChange={e => handleChangeService(i, 'price', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label='Bảo hành'
                  value={s.warranty}
                  onChange={e => handleChangeService(i, 'warranty', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={1}>
                <Button onClick={() => handleRemoveServiceRow(i)}>X</Button>
              </Grid>
            </Grid>
          ))}
          <Button onClick={handleAddServiceRow}>+ Thêm dòng dịch vụ</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant='contained' onClick={handleSubmit}>
            {editId ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default ServicePage
