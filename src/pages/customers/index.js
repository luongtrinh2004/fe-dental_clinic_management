/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable padding-line-between-statements */
/* eslint-disable newline-before-return */
import { useEffect, useState } from 'react'
import axios from 'axios'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
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
  Stack
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Link from 'next/link'
import { useRouter } from 'next/router'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const LIMIT = 20

const CustomersPage = () => {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  useEffect(() => {
    fetchPatients()
  }, [page])

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const { data } = await axios.get(`${API_URL}/v1/patients?page=${page}&limit=${LIMIT}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const patientsWithHistory = await Promise.all(
        data.results.map(async patient => {
          const patientId = patient.id || patient._id
          try {
            const historyRes = await axios.get(`${API_URL}/v1/medical-histories/patient/${patientId}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            return {
              ...patient,
              _id: patientId,
              latestHistory: historyRes.data?.[0] || null
            }
          } catch {
            return { ...patient, _id: patientId, latestHistory: null }
          }
        })
      )

      setPatients(patientsWithHistory)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('❌ Lỗi lấy danh sách bệnh nhân:', error)
    }
  }

  const filteredPatients = patients.filter(p => {
    const keyword = search.toLowerCase()
    return (
      !search ||
      p.name?.toLowerCase().includes(keyword) ||
      p.phone?.includes(keyword) ||
      p.patientCode?.includes(keyword)
    )
  })

  const handleDelete = async id => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) {
      try {
        const token = localStorage.getItem('accessToken')
        await axios.delete(`${API_URL}/v1/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchPatients()
      } catch (error) {
        console.error('❌ Lỗi xóa bệnh nhân:', error)
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
              fullWidth
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Link href='/customers/create' passHref legacyBehavior>
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
                      <TableCell>{patient.gender === 0 ? 'Nam' : patient.gender === 1 ? 'Nữ' : 'Khác'}</TableCell>
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

            {/* Pagination */}
            <Stack direction='row' justifyContent='flex-end' alignItems='center' spacing={1} sx={{ mt: 2 }}>
              <IconButton onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} size='small'>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant='body2'>
                Trang {page} / {totalPages}
              </Typography>
              <IconButton
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                size='small'
              >
                <ChevronRightIcon />
              </IconButton>
            </Stack>

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

CustomersPage.acl = {
  action: 'read',
  subject: 'customer-page'
}

export default CustomersPage
