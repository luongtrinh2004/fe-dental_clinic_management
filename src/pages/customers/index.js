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
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const CustomersPage = () => {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    medicalHistory: '',
    note: '',
    cost: 0,
    nextAppointmentDate: '',
    status: 'Đang điều trị'
  })
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/v1/patients')
      setPatients(response.data)
    } catch (error) {
      console.error('Lỗi lấy danh sách bệnh nhân:', error)
    }
  }

  const filteredPatients = patients.filter(
    patient => patient.name.toLowerCase().includes(search.toLowerCase()) || patient.phone.includes(search)
  )

  const handleDelete = async id => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) {
      try {
        await axios.delete(`http://localhost:5000/v1/patients/${id}`)
        fetchPatients()
      } catch (error) {
        console.error('Lỗi xóa bệnh nhân:', error)
      }
    }
  }

  const handleEdit = patient => {
    setFormData({
      name: patient.name,
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.substring(0, 10) : '',
      phone: patient.phone,
      address: patient.address,
      medicalHistory: patient.medicalHistory || '',
      note: patient.note || '',
      cost: patient.cost || 0,
      nextAppointmentDate: patient.nextAppointmentDate ? patient.nextAppointmentDate.substring(0, 10) : '',
      status: patient.status
    })
    setEditId(patient._id)
    setOpenDialog(true)
  }

  const handleAdd = () => {
    setFormData({
      name: '',
      gender: '',
      dateOfBirth: '',
      phone: '',
      address: '',
      medicalHistory: '',
      note: '',
      cost: 0,
      nextAppointmentDate: '',
      status: 'Đang điều trị'
    })
    setEditId(null)
    setOpenDialog(true)
  }

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/v1/patients/${editId}`, formData)
      } else {
        await axios.post('http://localhost:5000/v1/patients', formData)
      }
      setOpenDialog(false)
      fetchPatients()
    } catch (error) {
      console.error('Lỗi thêm/sửa bệnh nhân:', error)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Tìm kiếm bệnh nhân' />
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label='Nhập tên hoặc số điện thoại'
              variant='outlined'
              fullWidth
              size='medium'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Button variant='contained' onClick={handleAdd}>
              + Thêm bệnh nhân
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Danh sách bệnh nhân' />
          <CardContent>
            <TableContainer component={Paper}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã BN</TableCell>
                    <TableCell>Họ tên</TableCell>
                    <TableCell>Giới tính</TableCell>
                    <TableCell>Ngày sinh</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                    <TableCell>Dịch vụ</TableCell>
                    <TableCell>Ghi chú</TableCell>
                    <TableCell>Chi phí</TableCell>
                    <TableCell>Hẹn tái khám</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPatients.map(patient => (
                    <TableRow key={patient._id}>
                      <TableCell>{patient.patientCode || 'N/A'}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>
                        {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.medicalHistory || 'N/A'}</TableCell>
                      <TableCell>{patient.note || 'N/A'}</TableCell>
                      <TableCell>{patient.cost?.toLocaleString() || '0'} ₫</TableCell>
                      <TableCell>
                        {patient.nextAppointmentDate
                          ? new Date(patient.nextAppointmentDate).toLocaleDateString()
                          : 'Chưa hẹn'}
                      </TableCell>
                      <TableCell>{patient.status}</TableCell>
                      <TableCell>
                        <IconButton color='primary' onClick={() => handleEdit(patient)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color='error' onClick={() => handleDelete(patient._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {filteredPatients.length === 0 && (
              <Typography variant='body2' align='center' sx={{ mt: 2 }}>
                Không tìm thấy bệnh nhân nào
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Form Thêm/Sửa bệnh nhân */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth='sm' fullWidth>
        <DialogTitle>{editId ? 'Sửa thông tin bệnh nhân' : 'Thêm bệnh nhân mới'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label='Họ tên'
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Giới tính</InputLabel>
            <Select
              value={formData.gender}
              label='Giới tính'
              onChange={e => setFormData({ ...formData, gender: e.target.value })}
            >
              <MenuItem value='Nam'>Nam</MenuItem>
              <MenuItem value='Nữ'>Nữ</MenuItem>
              <MenuItem value='Khác'>Khác</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label='Ngày sinh'
            type='date'
            value={formData.dateOfBirth}
            onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label='Số điện thoại'
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            fullWidth
          />
          <TextField
            label='Địa chỉ'
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            fullWidth
          />
          <TextField
            label='Dịch vụ'
            value={formData.medicalHistory}
            onChange={e => setFormData({ ...formData, medicalHistory: e.target.value })}
            fullWidth
          />
          <TextField
            label='Ghi chú'
            value={formData.note}
            onChange={e => setFormData({ ...formData, note: e.target.value })}
            fullWidth
          />
          <TextField
            label='Chi phí'
            type='number'
            value={formData.cost}
            onChange={e => setFormData({ ...formData, cost: e.target.value })}
            fullWidth
          />
          <TextField
            label='Ngày hẹn tái khám'
            type='date'
            value={formData.nextAppointmentDate}
            onChange={e => setFormData({ ...formData, nextAppointmentDate: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={formData.status}
              label='Trạng thái'
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value='Đang điều trị'>Đang điều trị</MenuItem>
              <MenuItem value='Hoàn thành điều trị'>Hoàn thành điều trị</MenuItem>
              <MenuItem value='Hủy bỏ điều trị'>Hủy bỏ điều trị</MenuItem>
            </Select>
          </FormControl>
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

export default CustomersPage
