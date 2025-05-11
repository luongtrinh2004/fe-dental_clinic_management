/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Typography,
  Stack,
  Chip
} from '@mui/material'
import DatePicker from 'react-multi-date-picker'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const genderLabel = ['Nam', 'Nữ', 'Khác']
const genderValue = { Nam: 0, Nữ: 1, Khác: 2 }

const UpdateCustomerPage = () => {
  const router = useRouter()
  const { id } = router.query

  const [patient, setPatient] = useState(null)
  const [history, setHistory] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchPatientData()
    }
  }, [id])

  const fetchPatientData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const headers = { Authorization: `Bearer ${token}` }

      const [patientRes, historyRes] = await Promise.all([
        axios.get(`${API_URL}/v1/patients/${id}`, { headers }),
        axios.get(`${API_URL}/v1/medical-histories/patient/${id}`, { headers })
      ])

      const fetchedPatient = patientRes.data
      fetchedPatient.gender = genderLabel[fetchedPatient.gender]

      setPatient(fetchedPatient)
      setHistory(historyRes.data?.[0] || null)
    } catch (err) {
      console.error(' Lỗi khi tải dữ liệu:', err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setPatient(prev => ({ ...prev, [field]: value }))
  }

  const handleHistoryChange = (field, value) => {
    setHistory(prev => ({ ...(prev || {}), [field]: value }))
  }

  const handleAddDate = () => {
    if (!selectedDate) return
    const newDate = selectedDate.toDate()
    const existing = history?.nextAppointmentDates || []
    const isDuplicate = existing.some(d => new Date(d).toDateString() === newDate.toDateString())
    if (!isDuplicate) {
      handleHistoryChange('nextAppointmentDates', [...existing, newDate])
      setSelectedDate(null)
    }
  }

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const headers = { Authorization: `Bearer ${token}` }

      // Chỉ gửi các trường được phép trong Joi schema
      const updatePayload = {
        name: patient.name,
        gender: genderValue[patient.gender],
        dateOfBirth: patient.dateOfBirth,
        phone: patient.phone,
        address: patient.address
      }

      // PATCH bệnh nhân
      await axios.patch(`${API_URL}/v1/patients/${id}`, updatePayload, { headers })

      // PATCH or POST lịch sử khám
      if (history?.appointmentDate && history.medicalService) {
        const payload = {
          medicalService: history.medicalService,
          note: history.note || '',
          cost: parseInt(history.cost || 0),
          appointmentDate: history.appointmentDate,
          nextAppointmentDates: history.nextAppointmentDates || []
        }

        if (history._id) {
          await axios.patch(`${API_URL}/v1/medical-histories/${history._id}`, payload, { headers })
        } else {
          await axios.post(`${API_URL}/v1/medical-histories`, { ...payload, patientId: id }, { headers })
        }
      }

      alert('Cập nhật thành công!')
      router.push('/customers')
    } catch (err) {
      console.error('Lỗi cập nhật:', err.response?.data || err.message)
      alert('Cập nhật thất bại. Vui lòng thử lại!')
    }
  }

  if (loading) return <Typography variant='body1'>Đang tải dữ liệu...</Typography>
  if (!patient) return <Typography variant='body1'>Không tìm thấy bệnh nhân</Typography>

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Cập nhật thông tin bệnh nhân' />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label='Họ tên'
              value={patient.name}
              onChange={e => handleChange('name', e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Giới tính</InputLabel>
              <Select value={patient.gender} onChange={e => handleChange('gender', e.target.value)} label='Giới tính'>
                {genderLabel.map(label => (
                  <MenuItem key={label} value={label}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label='Ngày sinh'
              type='date'
              InputLabelProps={{ shrink: true }}
              value={patient.dateOfBirth?.substring(0, 10) || ''}
              onChange={e => handleChange('dateOfBirth', e.target.value)}
              fullWidth
            />
            <TextField
              label='Số điện thoại'
              value={patient.phone}
              onChange={e => handleChange('phone', e.target.value)}
              fullWidth
            />
            <TextField
              label='Địa chỉ'
              value={patient.address}
              onChange={e => handleChange('address', e.target.value)}
              fullWidth
            />

            <hr />
            <Typography variant='h6'>Thông tin khám</Typography>

            <TextField
              label='Dịch vụ'
              value={history?.medicalService || ''}
              onChange={e => handleHistoryChange('medicalService', e.target.value)}
              fullWidth
            />
            <TextField
              label='Ghi chú'
              value={history?.note || ''}
              onChange={e => handleHistoryChange('note', e.target.value)}
              fullWidth
            />
            <TextField
              label='Chi phí'
              type='number'
              value={history?.cost || ''}
              onChange={e => handleHistoryChange('cost', e.target.value)}
              fullWidth
            />
            <TextField
              label='Ngày khám'
              type='date'
              InputLabelProps={{ shrink: true }}
              value={history?.appointmentDate?.substring(0, 10) || ''}
              onChange={e => handleHistoryChange('appointmentDate', e.target.value)}
              fullWidth
            />

            <Typography variant='body2'>Ngày hẹn tái khám</Typography>
            <Stack direction='row' spacing={1} flexWrap='wrap' sx={{ mb: 1 }}>
              {(history?.nextAppointmentDates || []).map((date, index) => (
                <Chip
                  key={index}
                  label={new Date(date).toLocaleDateString('vi-VN')}
                  onDelete={() => {
                    const updatedDates = history.nextAppointmentDates.filter((_, i) => i !== index)
                    handleHistoryChange('nextAppointmentDates', updatedDates)
                  }}
                  color='primary'
                  variant='outlined'
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>

            <Stack direction='row' spacing={2} alignItems='center'>
              <DatePicker
                format='DD/MM/YYYY'
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder='Chọn ngày hẹn mới'
                style={{ width: '100%' }}
              />
              <Button variant='outlined' onClick={handleAddDate}>
                Thêm
              </Button>
            </Stack>

            <Button variant='contained' sx={{ mt: 2 }} onClick={handleSubmit}>
              Lưu thay đổi
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

UpdateCustomerPage.acl = {
  action: 'read',
  subject: 'update-customer-page'
}

export default UpdateCustomerPage
