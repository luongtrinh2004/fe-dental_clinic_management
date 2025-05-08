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
  Button
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Link from 'next/link'
import { useRouter } from 'next/router'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const CustomersPage = () => {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API_URL}/v1/patients`)
      const patientsWithHistory = await Promise.all(
        response.data.map(async patient => {
          const historyRes = await axios.get(`${API_URL}/v1/medical-history/patient/${patient._id}`)
          return {
            ...patient,
            latestHistory: historyRes.data?.[0] || null
          }
        })
      )
      setPatients(patientsWithHistory)
    } catch (error) {
      console.error('Lỗi lấy danh sách bệnh nhân:', error)
    }
  }

  const filteredPatients = patients.filter(
    patient =>
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone.includes(search) ||
      (patient.patientCode && patient.patientCode.includes(search))
  )

  const handleDelete = async id => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) {
      try {
        await axios.delete(`${API_URL}/v1/patients/${id}`)
        fetchPatients()
      } catch (error) {
        console.error('Lỗi xóa bệnh nhân:', error)
      }
    }
  }

  const handleEdit = patient => {
    router.push(`/customers/update/${patient._id}`)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Tìm kiếm bệnh nhân' />
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label='Nhập tên, mã BN hoặc số điện thoại'
              variant='outlined'
              fullWidth
              size='medium'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Link href='/customers/create' passHref>
              <Button variant='contained' component='a'>
                + Thêm bệnh nhân
              </Button>
            </Link>
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
                    <TableCell>Ngày khám</TableCell>
                    <TableCell>Hẹn tái khám</TableCell>
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
                        {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}
                      </TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.latestHistory?.medicalService || 'N/A'}</TableCell>
                      <TableCell>{patient.latestHistory?.note || 'N/A'}</TableCell>
                      <TableCell>{(patient.latestHistory?.cost || 0).toLocaleString()} ₫</TableCell>
                      <TableCell>
                        {patient.latestHistory?.appointmentDate
                          ? new Date(patient.latestHistory.appointmentDate).toLocaleDateString('vi-VN')
                          : 'Chưa khám'}
                      </TableCell>
                      <TableCell>
                        {patient.latestHistory?.nextAppointmentDates?.length > 0
                          ? new Date(patient.latestHistory.nextAppointmentDates.slice(-1)[0]).toLocaleDateString(
                              'vi-VN'
                            )
                          : 'Chưa hẹn'}
                      </TableCell>
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
    </Grid>
  )
}

export default CustomersPage
