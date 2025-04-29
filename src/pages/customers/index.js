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
  Typography
} from '@mui/material'

const CustomersPage = () => {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/v1/patients')
        setPatients(response.data)
      } catch (error) {
        console.error('Lỗi lấy danh sách bệnh nhân:', error)
      }
    }

    fetchPatients()
  }, [])

  const filteredPatients = patients.filter(
    patient => patient.name.toLowerCase().includes(search.toLowerCase()) || patient.phone.includes(search)
  )

  return (
    <Grid container spacing={6}>
      {/* Phần Search ở trên cùng */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Tìm kiếm bệnh nhân' />
          <CardContent>
            <TextField
              label='Nhập tên hoặc số điện thoại'
              variant='outlined'
              fullWidth
              size='medium'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Phần bảng danh sách bệnh nhân ở giữa */}
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
                    <TableCell>Dịch vụ</TableCell> {/* medicalHistory */}
                    <TableCell>Ghi chú</TableCell>
                    <TableCell>Chi phí</TableCell>
                    <TableCell>Hẹn tái khám</TableCell>
                    <TableCell>Trạng thái</TableCell>
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
